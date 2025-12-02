import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

@Injectable()
export class PrayerService {
    async getPrayerTimesByCity(
        city: string,
        country: string,
        method: number = 2,
    ) {
        try {
            const response = await axios.get(
                `${ALADHAN_API_BASE}/timingsByCity`,
                {
                    params: { city, country, method },
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch prayer times',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getPrayerTimesByCoordinates(
        latitude: number,
        longitude: number,
        method: number = 2,
    ) {
        try {
            const response = await axios.get(
                `${ALADHAN_API_BASE}/timings`,
                {
                    params: { latitude, longitude, method },
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch prayer times',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getCalendarByCity(
        city: string,
        country: string,
        month: number,
        year: number,
        method: number = 2,
    ) {
        try {
            const response = await axios.get(
                `${ALADHAN_API_BASE}/calendarByCity`,
                {
                    params: { city, country, month, year, method },
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch calendar',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
