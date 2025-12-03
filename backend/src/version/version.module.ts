import { Module } from '@nestjs/common';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [VersionController],
    providers: [VersionService, PrismaService],
})
export class VersionModule { }
