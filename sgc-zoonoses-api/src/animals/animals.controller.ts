
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

import { AnimalsService } from './animals.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('animals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TUTOR')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(
    @Body() dto: CreateAnimalDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.animalsService.create(dto, request.user);
  }

  @Get('my-animals')
  findMyAnimals(@Req() request: AuthenticatedRequest) {
    return this.animalsService.findMyAnimals(request.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.animalsService.update(id, dto, request.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.animalsService.remove(id, request.user);
  }
}
