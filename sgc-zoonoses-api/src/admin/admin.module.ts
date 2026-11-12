
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

import { AdminSolicitationsController } from './solicitations/admin-solicitations.controller.js';
import { AdminSolicitationsService } from './solicitations/admin-solicitations.service.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    AdminController,
    AdminSolicitationsController,
  ],
  providers: [
    AdminService,
    AdminSolicitationsService,
  ],
})
export class AdminModule {}
