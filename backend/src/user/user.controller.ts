import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @Post('favorites')
    addFavorite(
        @Request() req: any,
        @Body() body: { surahNumber: number; ayahNumber: number },
    ) {
        return this.userService.addFavorite(
            req.user.id,
            body.surahNumber,
            body.ayahNumber,
        );
    }

    @Get('favorites')
    getFavorites(@Request() req: any) {
        return this.userService.getFavorites(req.user.id);
    }

    @Delete('favorites/:id')
    removeFavorite(@Request() req: any, @Param('id') id: string) {
        return this.userService.removeFavorite(id, req.user.id);
    }

    @Post('reading-history')
    updateReadingHistory(
        @Request() req: any,
        @Body() body: { surahNumber: number; ayahNumber: number },
    ) {
        return this.userService.updateReadingHistory(
            req.user.id,
            body.surahNumber,
            body.ayahNumber,
        );
    }

    @Get('reading-history')
    getReadingHistory(@Request() req: any) {
        return this.userService.getReadingHistory(req.user.id);
    }

    @Post('prayer-settings')
    updatePrayerSettings(
        @Request() req: any,
        @Body()
        body: {
            calculationMethod?: string;
            madhab?: string;
            latitude?: number;
            longitude?: number;
        },
    ) {
        return this.userService.updatePrayerSettings(
            req.user.id,
            body.calculationMethod,
            body.madhab,
            body.latitude,
            body.longitude,
        );
    }

    @Get('prayer-settings')
    getPrayerSettings(@Request() req: any) {
        return this.userService.getPrayerSettings(req.user.id);
    }
}
