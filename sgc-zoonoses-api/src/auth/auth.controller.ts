
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './roles.decorator.js';
import { RegisterTutorDto } from './dto/register-tutor.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto.js';
import type { UploadedImage } from '../storage/cloudinary.service.js';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizacaoId: string;
    nome: string;
    email: string;
    papel: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerTutor(@Body() dto: RegisterTutorDto) {
    return this.authService.registerTutor(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification')
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Retorna os dados básicos do usuário autenticado.
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  // Retorna os dados completos do tutor autenticado.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @Get('profile')
  async getTutorProfile(@Req() request: AuthenticatedRequest) {
    const tutor = await this.authService.getTutorProfile(
      request.user.id,
      request.user.organizacaoId,
    );

    const fotoPerfilUrl =
      await this.authService.getTutorProfilePhoto(
        request.user.id,
        request.user.organizacaoId,
      );

    return {
      usuario: {
        id: request.user.id,
        nome: request.user.nome,
        email: request.user.email,
        papel: request.user.papel,
        fotoPerfilUrl,
      },
      tutor,
    };
  }

  // Atualiza os dados do perfil do tutor autenticado.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @Patch('profile')
  updateTutorProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateTutorProfileDto,
  ) {
    return this.authService.updateTutorProfile(
      request.user.id,
      request.user.organizacaoId,
      dto,
    );
  }

  // Envia ou substitui a foto de perfil do tutor.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @Post('profile/photo')
  @UseInterceptors(
    FileInterceptor('foto', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadProfilePhoto(
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

    return this.authService.uploadTutorProfilePhoto(
      request.user.id,
      request.user.organizacaoId,
      file,
    );
  }

  // Remove a foto de perfil do tutor.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @Delete('profile/photo')
  removeProfilePhoto(@Req() request: AuthenticatedRequest) {
    return this.authService.removeTutorProfilePhoto(
      request.user.id,
      request.user.organizacaoId,
    );
  }

  // Rota de teste: somente ADMIN pode acessá-la.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-check')
  adminCheck() {
    return {
      status: 'ok',
      message: 'Acesso administrativo autorizado.',
    };
  }
}
