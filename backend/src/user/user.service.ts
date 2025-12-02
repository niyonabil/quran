import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async addFavorite(userId: string, surahNumber: number, ayahNumber: number) {
        return this.prisma.favorite.create({
            data: {
                userId,
                surahNumber,
                ayahNumber,
            },
        });
    }

    async getFavorites(userId: string) {
        return this.prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async removeFavorite(favoriteId: string, userId: string) {
        return this.prisma.favorite.deleteMany({
            where: { id: favoriteId, userId },
        });
    }

    async updateReadingHistory(userId: string, surahNumber: number, ayahNumber: number) {
        const existing = await this.prisma.readingHistory.findFirst({
            where: { userId },
        });

        if (existing) {
            return this.prisma.readingHistory.update({
                where: { id: existing.id },
                data: { surahNumber, ayahNumber, lastReadAt: new Date() },
            });
        }

        return this.prisma.readingHistory.create({
            data: { userId, surahNumber, ayahNumber },
        });
    }

    async getReadingHistory(userId: string) {
        return this.prisma.readingHistory.findFirst({
            where: { userId },
            orderBy: { lastReadAt: 'desc' },
        });
    }

    async updatePrayerSettings(
        userId: string,
        calculationMethod?: string,
        madhab?: string,
        latitude?: number,
        longitude?: number,
    ) {
        const existing = await this.prisma.prayerSettings.findUnique({
            where: { userId },
        });

        const data: any = {};
        if (calculationMethod !== undefined) data.calculationMethod = calculationMethod;
        if (madhab !== undefined) data.madhab = madhab;
        if (latitude !== undefined) data.latitude = latitude;
        if (longitude !== undefined) data.longitude = longitude;

        if (existing) {
            return this.prisma.prayerSettings.update({
                where: { userId },
                data,
            });
        }

        return this.prisma.prayerSettings.create({
            data: { userId, ...data },
        });
    }

    async getPrayerSettings(userId: string) {
        return this.prisma.prayerSettings.findUnique({
            where: { userId },
        });
    }
}
