
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

interface AuthenticatedUser {
  id: string;
  organizacaoId: string;
  papel: string;
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveServices(usuario: AuthenticatedUser) {
    return this.prisma.servico.findMany({
      where: {
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }
}
