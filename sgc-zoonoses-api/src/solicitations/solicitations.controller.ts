
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

import { CreateSolicitationDto } from './dto/create-solicitation.dto.js';
import { SolicitationsService } from './solicitations.service.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('solicitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TUTOR')
export class SolicitationsController {
  constructor(
    private readonly solicitationsService: SolicitationsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSolicitationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.solicitationsService.create(
      dto,
      request.user,
    );
  }

  @Get('my')
  findMySolicitations(@Req() request: AuthenticatedRequest) {
    return this.solicitationsService.findMySolicitations(
      request.user,
    );
  }

  @Get('my/:id')
  findMySolicitation(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.solicitationsService.findMySolicitation(
      id,
      request.user,
    );
  }
}
