
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // Por enquanto, o login pertence à organização de Cajazeiras.
    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: {
        id: true,
        ativa: true,
      },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        organizacaoId_email: {
          organizacaoId: organizacao.id,
          email,
        },
      },
      select: {
        id: true,
        organizacaoId: true,
        nome: true,
        email: true,
        senhaHash: true,
        papel: true,
        ativo: true,
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(
      dto.password,
      usuario.senhaHash,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcessoEm: new Date() },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      organizacaoId: usuario.organizacaoId,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  }
}
