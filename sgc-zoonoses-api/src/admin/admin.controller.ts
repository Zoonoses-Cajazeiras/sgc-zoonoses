
import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

import { AdminService } from './admin.service.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('admin/tutors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  listarTutores(
    @Req() request: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.listarTutores(
      request.user.organizacaoId,
      page,
      limit,
      search,
    );
  }

  @Get(':id')
  consultarTutor(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminService.consultarTutor(
      id,
      request.user.organizacaoId,
    );
  }
}
