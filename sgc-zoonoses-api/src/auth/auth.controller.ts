
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './roles.decorator.js';
import { RegisterTutorDto } from './dto/register-tutor.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';

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

    return {
      usuario: {
        id: request.user.id,
        nome: request.user.nome,
        email: request.user.email,
        papel: request.user.papel,
      },
      tutor,
    };
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
