import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { StatsService } from './stats.service.js';
import { UpdateImpactStatsDto } from './dto/update-impact-stats.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    papel: string;
  };
}

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
  ) {}

  // Consulta pública dos números de impacto.
  @Get()
  findPublic() {
    return this.statsService.findPublic();
  }

  // Atualização permitida somente para administradores.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImpactStatsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.statsService.update(
      id,
      request.user.organizacaoId,
      dto,
    );
  }
}