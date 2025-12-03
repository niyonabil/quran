import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('donations')
export class DonationsController {
    constructor(private readonly donationsService: DonationsService) { }

    @Get()
    async getActiveMethods() {
        return this.donationsService.getActiveMethods();
    }

    // Admin only endpoint in future, for now public or protected
    @Post('seed')
    async seedDefaults() {
        return this.donationsService.seedDefaults();
    }
}
