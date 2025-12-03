import { Controller, Get, Query } from '@nestjs/common';
import { VersionService } from './version.service';

@Controller('version')
export class VersionController {
    constructor(private readonly versionService: VersionService) { }

    @Get('check')
    async checkVersion(
        @Query('platform') platform: 'android' | 'ios',
        @Query('currentVersion') currentVersion: string,
        @Query('currentCode') currentCode: string,
    ) {
        const versionCode = parseInt(currentCode, 10);
        return this.versionService.checkVersion(
            platform,
            currentVersion,
            versionCode,
        );
    }
}
