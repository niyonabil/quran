import { Controller, Get, Query } from '@nestjs/common';
import { PrayerService } from './prayer.service';

@Controller('prayer')
export class PrayerController {
    constructor(private prayerService: PrayerService) { }

    @Get('times/city')
    getPrayerTimesByCity(
        @Query('city') city: string,
        @Query('country') country: string,
        @Query('method') method?: string,
    ) {
        return this.prayerService.getPrayerTimesByCity(
            city,
            country,
            method ? parseInt(method) : 2,
        );
    }

    @Get('times/coordinates')
    getPrayerTimesByCoordinates(
        @Query('latitude') latitude: string,
        @Query('longitude') longitude: string,
        @Query('method') method?: string,
    ) {
        return this.prayerService.getPrayerTimesByCoordinates(
            parseFloat(latitude),
            parseFloat(longitude),
            method ? parseInt(method) : 2,
        );
    }

    @Get('calendar')
    getCalendarByCity(
        @Query('city') city: string,
        @Query('country') country: string,
        @Query('month') month: string,
        @Query('year') year: string,
        @Query('method') method?: string,
    ) {
        return this.prayerService.getCalendarByCity(
            city,
            country,
            parseInt(month),
            parseInt(year),
            method ? parseInt(method) : 2,
        );
    }
}
