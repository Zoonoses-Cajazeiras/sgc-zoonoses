
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

import { SolicitationsController } from './solicitations.controller.js';
import { SolicitationsService } from './solicitations.service.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SolicitationsController],
  providers: [SolicitationsService],
})
export class SolicitationsModule {}
