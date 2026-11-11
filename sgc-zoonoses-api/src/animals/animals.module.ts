
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { StorageModule } from '../storage/storage.module.js';

import { AnimalsController } from './animals.controller.js';
import { AnimalsService } from './animals.service.js';

@Module({
  imports: [PrismaModule, AuthModule, StorageModule],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
