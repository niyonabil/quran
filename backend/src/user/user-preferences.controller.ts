import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AdhanPreferences {
    defaultAdhan?: string;
    fajrAdhan?: string;
    dhuhrAdhan?: string;
    asrAdhan?: string;
    maghribAdhan?: string;
    ishaAdhan?: string;
}

interface ThemePreferences {
    preset?: string;
    backgroundImage?: string;
}

@Controller('user/preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
    constructor(private readonly preferencesService: UserPreferencesService) { }

    @Get('adhan')
    async getAdhanPreferences(@Request() req) {
        return this.preferencesService.getAdhanPreferences(req.user.userId);
    }

    @Put('adhan')
    async updateAdhanPreferences(
        @Request() req,
        @Body() preferences: AdhanPreferences,
    ) {
        return this.preferencesService.updateAdhanPreferences(
            req.user.userId,
            preferences,
        );
    }

    @Get('theme')
    async getThemePreferences(@Request() req) {
        return this.preferencesService.getThemePreferences(req.user.userId);
    }

    @Put('theme')
    async updateThemePreferences(
        @Request() req,
        @Body() preferences: ThemePreferences,
    ) {
        return this.preferencesService.updateThemePreferences(
            req.user.userId,
            preferences,
        );
    }
}
