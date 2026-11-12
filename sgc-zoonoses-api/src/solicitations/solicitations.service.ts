
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { StatusSolicitacao } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

import { CreateSolicitationDto } from './dto/create-solicitation.dto.js';

interface AuthenticatedUser {
  id: string;
  organizacaoId: string;
  papel: string;
}

@Injectable()
export class SolicitationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async buscarTutor(usuario: AuthenticatedUser) {
    if (usuario.papel !== 'TUTOR') {
      throw new ForbiddenException(
        'Somente tutores podem realizar esta operação.',
      );
    }

    const tutor = await this.prisma.tutor.findFirst({
      where: {
        usuarioId: usuario.id,
        organizacaoId: usuario.organizacaoId,
      },
      select: {
        id: true,
      },
    });

    if (!tutor) {
      throw new NotFoundException('Perfil de tutor não encontrado.');
    }

    return tutor;
  }

  async create(
    dto: CreateSolicitationDto,
    usuario: AuthenticatedUser,
  ) {
    const tutor = await this.buscarTutor(usuario);

    const animal = await this.prisma.animal.findFirst({
      where: {
        id: dto.animalId,
        tutorId: tutor.id,
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
      select: {
        id: true,
      },
    });

    if (!animal) {
      throw new NotFoundException(
        'Animal não encontrado ou não pertence ao seu cadastro.',
      );
    }

    const servico = await this.prisma.servico.findFirst({
      where: {
        id: dto.servicoId,
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
      },
    });

    if (!servico) {
      throw new NotFoundException(
        'Serviço não encontrado ou indisponível.',
      );
    }

    const observacoes = dto.observacoes?.trim() || null;

    const nomeServico = servico.nome
      .trim()
      .toLocaleLowerCase('pt-BR');

    const exigeDescricao = [
      'outros procedimentos',
      'outro serviço',
      'outro servico',
    ].includes(nomeServico);

    if (exigeDescricao && !observacoes) {
      throw new BadRequestException(
        'Descreva o procedimento desejado.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const solicitacao = await tx.solicitacao.create({
        data: {
          organizacaoId: usuario.organizacaoId,
          tutorId: tutor.id,
          animalId: animal.id,
          servicoId: servico.id,
          status: StatusSolicitacao.PENDENTE,
          observacoes,
        },
      });

      await tx.historicoSolicitacao.create({
        data: {
          solicitacaoId: solicitacao.id,
          statusNovo: StatusSolicitacao.PENDENTE,
          observacao: 'Solicitação registrada pelo tutor.',
          alteradoPorId: usuario.id,
        },
      });

      return tx.solicitacao.findUnique({
        where: {
          id: solicitacao.id,
        },
        include: {
          animal: {
            select: {
              id: true,
              nome: true,
              especie: true,
            },
          },
          servico: {
            select: {
              id: true,
              nome: true,
            },
          },
          historicos: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    });
  }

  async findMySolicitations(usuario: AuthenticatedUser) {
    const tutor = await this.buscarTutor(usuario);

    return this.prisma.solicitacao.findMany({
      where: {
        organizacaoId: usuario.organizacaoId,
        tutorId: tutor.id,
      },
      include: {
        animal: {
          select: {
            id: true,
            nome: true,
            especie: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMySolicitation(
    id: string,
    usuario: AuthenticatedUser,
  ) {
    const tutor = await this.buscarTutor(usuario);

    const solicitacao = await this.prisma.solicitacao.findFirst({
      where: {
        id,
        organizacaoId: usuario.organizacaoId,
        tutorId: tutor.id,
      },
      include: {
        animal: {
          select: {
            id: true,
            nome: true,
            especie: true,
            sexo: true,
            raca: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        },
        historicos: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    return solicitacao;
  }
}
