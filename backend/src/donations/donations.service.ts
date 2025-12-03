import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DonationsService {
    constructor(private prisma: PrismaService) { }

    async getActiveMethods() {
        return this.prisma.donationMethod.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    async seedDefaults() {
        const count = await this.prisma.donationMethod.count();
        if (count > 0) return { message: 'Already seeded' };

        await this.prisma.donationMethod.createMany({
            data: [
                {
                    name: 'WhatsApp',
                    description: 'Contact us directly for support',
                    identifier: 'https://wa.me/212629605450',
                    type: 'link',
                    icon: 'logo-whatsapp'
                },
                {
                    name: 'PayPal',
                    description: 'Support us via PayPal',
                    identifier: 'https://paypal.me/niyonabil', // Placeholder, user can update
                    type: 'link',
                    icon: 'logo-paypal'
                }
            ]
        });

        return { message: 'Seeded default donation methods' };
    }
}
