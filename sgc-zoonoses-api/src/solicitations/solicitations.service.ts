
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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

  private obterPrefixoServico(nomeServico: string): string {
    const nomeNormalizado = nomeServico
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const prefixos: Record<string, string> = {
      castracao: 'CA',
      'atendimento veterinario': 'AV',
      'outros procedimentos': 'OS',
      vacinacao: 'VA',
    };

    const prefixo = prefixos[nomeNormalizado];

    if (!prefixo) {
      throw new BadRequestException(
        'Não existe um protocolo configurado para este serviço.',
      );
    }

    return prefixo;
  }

  private obterAnoAtual(): number {
    const ano = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Fortaleza',
      year: 'numeric',
    }).format(new Date());

    return Number(ano);
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

    const prefixo = this.obterPrefixoServico(servico.nome);
    const ano = this.obterAnoAtual();

    return this.prisma.$transaction(async (tx) => {
      // Cria ou incrementa o contador específico do serviço e do ano.
      const contador = await tx.contadorProtocolo.upsert({
        where: {
          organizacaoId_prefixo_ano: {
            organizacaoId: usuario.organizacaoId,
            prefixo,
            ano,
          },
        },
        create: {
          organizacaoId: usuario.organizacaoId,
          prefixo,
          ano,
          ultimoNumero: 1,
        },
        update: {
          ultimoNumero: {
            increment: 1,
          },
        },
        select: {
          ultimoNumero: true,
        },
      });

      if (contador.ultimoNumero > 999999) {
        throw new InternalServerErrorException(
          'O limite de protocolos deste serviço foi atingido.',
        );
      }

      const protocolo = `${prefixo}-${ano}-${String(
        contador.ultimoNumero,
      ).padStart(6, '0')}`;

      // Registra a solicitação com o protocolo gerado.
      const solicitacao = await tx.solicitacao.create({
        data: {
          organizacaoId: usuario.organizacaoId,
          tutorId: tutor.id,
          animalId: animal.id,
          servicoId: servico.id,
          protocolo,
          status: StatusSolicitacao.PENDENTE,
          observacoes,
        },
      });

      // Registra o histórico inicial da solicitação.
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
