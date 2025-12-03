import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserPreferencesController } from './user-preferences.controller';
import { UserService } from './user.service';
import { UserPreferencesService } from './user-preferences.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [UserController, UserPreferencesController],
    providers: [UserService, UserPreferencesService, PrismaService],
    exports: [UserService],
})
export class UserModule { }
