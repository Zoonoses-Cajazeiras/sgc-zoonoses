
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service.js';

interface JwtPayload {
  sub: string;
  organizacaoId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        organizacaoId: true,
        nome: true,
        email: true,
        papel: true,
        ativo: true,
        organizacao: {
          select: { ativa: true },
        },
      },
    });

    if (
      !usuario ||
      !usuario.ativo ||
      !usuario.organizacao.ativa ||
      usuario.organizacaoId !== payload.organizacaoId
    ) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    return {
      id: usuario.id,
      organizacaoId: usuario.organizacaoId,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    };
  }
}
