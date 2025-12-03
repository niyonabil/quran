import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface VersionCheckResponse {
    updateAvailable: boolean;
    isForced: boolean;
    latestVersion?: string;
    latestCode?: number;
    minSupportedVersion?: string;
    updateMessage?: string;
    downloadUrl?: string;
}

@Injectable()
export class VersionService {
    constructor(private prisma: PrismaService) { }

    async checkVersion(
        platform: 'android' | 'ios',
        currentVersion: string,
        currentCode: number,
    ): Promise<VersionCheckResponse> {
        try {
            // Requête SQL directe pour utiliser la fonction Supabase
            const result: any = await this.prisma.$queryRawUnsafe(
                `SELECT * FROM get_latest_version($1::text)`,
                platform,
            );

            if (!result || result.length === 0) {
                return {
                    updateAvailable: false,
                    isForced: false,
                };
            }

            const latest = result[0];
            const needsUpdate = currentCode < latest.version_code;
            const isForced =
                currentCode < latest.min_supported_code || latest.is_forced_update;

            return {
                updateAvailable: needsUpdate,
                isForced,
                latestVersion: latest.version_number,
                latestCode: latest.version_code,
                minSupportedVersion: latest.min_supported_version,
                updateMessage: latest.update_message,
                downloadUrl: latest.download_url,
            };
        } catch (error) {
            console.error('Version check error:', error);
            return {
                updateAvailable: false,
                isForced: false,
            };
        }
    }
}
