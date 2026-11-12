
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Patch,
  UseGuards,
  Delete,
  Param,
  ParseUUIDPipe
} from '@nestjs/common';

import { CampaignsService } from './campaigns.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    papel: string;
  };
}

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
  ) { }

  // Consulta pública das campanhas ativas.
  @Get()
  findPublic() {
    return this.campaignsService.findPublic();
  }

  // Cadastro permitido somente para administradores autenticados.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(
    @Body() dto: CreateCampaignDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.campaignsService.create(
      dto,
      request.user.organizacaoId,
      request.user.id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCampaignDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.campaignsService.update(
      id,
      request.user.organizacaoId,
      dto,
    );
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.campaignsService.remove(
      id,
      request.user.organizacaoId,
    );
  }


  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllForAdmin(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.campaignsService.findAllForAdmin(
      request.user.organizacaoId,
    );
  }


}
