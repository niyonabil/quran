import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserPreferencesService {
    constructor(private prisma: PrismaService) { }

    async getAdhanPreferences(userId: string) {
        const settings = await this.prisma.adhanSetting.findUnique({
            where: { userId },
        });

        return settings || {
            defaultAdhan: 'makkah',
            fajrAdhan: null,
            dhuhrAdhan: null,
            asrAdhan: null,
            maghribAdhan: null,
            ishaAdhan: null,
        };
    }

    async updateAdhanPreferences(userId: string, preferences: any) {
        return this.prisma.adhanSetting.upsert({
            where: { userId },
            create: {
                userId,
                ...preferences,
            },
            update: preferences,
        });
    }

    async getThemePreferences(userId: string) {
        // Since we don't have a ThemeSetting model yet, we'll use user's metadata
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        // For now, return default values
        // You can add a ThemeSetting model later if needed
        return {
            preset: 'default',
            backgroundImage: null,
        };
    }

    async updateThemePreferences(userId: string, preferences: any) {
        // For now, just acknowledge the update
        // You can store this in a separate table or user metadata
        return { success: true, ...preferences };
    }
}
