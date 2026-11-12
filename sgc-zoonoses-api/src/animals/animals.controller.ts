
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

import { CloudinaryService } from '../storage/cloudinary.service.js';
import type { UploadedImage } from '../storage/cloudinary.service.js';

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
  constructor(
    private readonly animalsService: AnimalsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('foto'))
  async uploadPhoto(
    @UploadedFile() file: UploadedImage | undefined,
    @Req() request: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Selecione uma imagem.');
    }

    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!formatosPermitidos.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato inválido. Envie uma imagem JPG, PNG ou WEBP.',
      );
    }

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (file.size > tamanhoMaximo) {
      throw new BadRequestException(
        'A imagem deve ter no máximo 5 MB.',
      );
    }

    const resultado = await this.cloudinaryService.uploadImage(
      file,
      `sgc-zoonoses/${request.user.organizacaoId}/animals`,
    );

    return {
      url: resultado.secure_url,
      publicId: resultado.public_id,
    };
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
