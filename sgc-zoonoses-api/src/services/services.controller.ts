
import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { ServicesService } from './services.service.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  findActiveServices(@Req() request: AuthenticatedRequest) {
    return this.servicesService.findActiveServices(
      request.user,
    );
  }
}
