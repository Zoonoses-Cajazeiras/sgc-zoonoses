import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { StatsModule } from './stats/stats.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports:[ConfigModule.forRoot({isGlobal: true,}),PrismaModule, CampaignsModule, StatsModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
