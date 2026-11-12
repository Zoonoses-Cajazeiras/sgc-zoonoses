
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

import { AdminSolicitationsService } from './admin-solicitations.service.js';
import { DecideSolicitationDto } from './dto/decide-solicitation.dto.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('admin/solicitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminSolicitationsController {
  constructor(
    private readonly adminSolicitationsService: AdminSolicitationsService,
  ) {}

  @Get()
  listarSolicitacoes(
    @Req() request: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('servicoId') servicoId?: string,
  ) {
    return this.adminSolicitationsService.listarSolicitacoes(
      request.user.organizacaoId,
      page,
      limit,
      search,
      status,
      servicoId,
    );
  }

  @Get('services')
  listarServicos(@Req() request: AuthenticatedRequest) {
    return this.adminSolicitationsService.listarServicos(
      request.user.organizacaoId,
    );
  }

  @Patch(':id/status')
  decidirSolicitacao(
    @Param('id') id: string,
    @Body() dto: DecideSolicitationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminSolicitationsService.decidirSolicitacao(
      id,
      request.user.organizacaoId,
      request.user.id,
      dto,
    );
  }

  @Get(':id')
  consultarSolicitacao(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminSolicitationsService.consultarSolicitacao(
      id,
      request.user.organizacaoId,
    );
  }
}
