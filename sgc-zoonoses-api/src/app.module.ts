
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { StatsModule } from './stats/stats.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PendingTutorsCleanupService } from './cleanup/pending-tutors-cleanup.service.js';
import { AnimalsModule } from './animals/animals.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    CampaignsModule,
    StatsModule,
    AuthModule,
    AnimalsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PendingTutorsCleanupService,
  ],
})
export class AppModule {}
