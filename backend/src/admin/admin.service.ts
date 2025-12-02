import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const totalFavorites = await this.prisma.favorite.count();
        const totalReadingHistory = await this.prisma.readingHistory.count();

        return {
            totalUsers,
            totalFavorites,
            totalReadingHistory,
            recentUsers: await this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            }),
        };
    }

    async deleteUser(userId: string) {
        // Delete related data first
        await this.prisma.favorite.deleteMany({ where: { userId } });
        await this.prisma.readingHistory.deleteMany({ where: { userId } });
        await this.prisma.prayerSettings.deleteMany({ where: { userId } });

        // Delete user
        return this.prisma.user.delete({ where: { id: userId } });
    }
}
