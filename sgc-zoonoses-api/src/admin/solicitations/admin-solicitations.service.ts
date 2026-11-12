
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { StatusSolicitacao } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DecideSolicitationDto } from './dto/decide-solicitation.dto.js';

@Injectable()
export class AdminSolicitationsService {
    constructor(private readonly prisma: PrismaService) { }

    async listarSolicitacoes(
        organizacaoId: string,
        pageParam?: string,
        limitParam?: string,
        searchParam?: string,
        statusParam?: string,
        servicoIdParam?: string,
    ) {
        const page = pageParam === undefined ? 1 : Number(pageParam);
        const limit = limitParam === undefined ? 10 : Number(limitParam);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new BadRequestException(
                'Página ou limite inválido. O limite máximo é 100.',
            );
        }

        let status: StatusSolicitacao | undefined;

        if (statusParam) {
            if (
                !Object.values(StatusSolicitacao).includes(
                    statusParam as StatusSolicitacao,
                )
            ) {
                throw new BadRequestException('Status inválido.');
            }

            status = statusParam as StatusSolicitacao;
        }

        const busca = searchParam?.trim();

        const buscaEhUuid =
            !!busca &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                busca,
            );

        const condicoesBusca = busca
            ? [
                {
                    tutor: {
                        is: {
                            usuario: {
                                is: {
                                    nome: {
                                        contains: busca,
                                        mode: 'insensitive' as const,
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    animal: {
                        is: {
                            nome: {
                                contains: busca,
                                mode: 'insensitive' as const,
                            },
                        },
                    },
                },
                {
                    servico: {
                        is: {
                            nome: {
                                contains: busca,
                                mode: 'insensitive' as const,
                            },
                        },
                    },
                },
            ]
            : [];

        const where = {
            organizacaoId,

            ...(status ? { status } : {}),

            ...(servicoIdParam ? { servicoId: servicoIdParam } : {}),

            ...(busca
                ? {
                    OR: [
                        ...condicoesBusca,
                        ...(buscaEhUuid ? [{ id: busca }] : []),
                    ],
                }
                : {}),
        };

        const [solicitacoes, total] = await this.prisma.$transaction([
            this.prisma.solicitacao.findMany({
                where,
                select: {
                    id: true,
                    status: true,
                    observacoes: true,
                    observacoesAnalise: true,
                    createdAt: true,
                    updatedAt: true,

                    tutor: {
                        select: {
                            id: true,
                            telefone: true,
                            usuario: {
                                select: {
                                    nome: true,
                                    email: true,
                                },
                            },
                        },
                    },

                    animal: {
                        select: {
                            id: true,
                            nome: true,
                            especie: true,
                            sexo: true,
                            porte: true,
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

                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.solicitacao.count({ where }),
        ]);

        return {
            data: solicitacoes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async consultarSolicitacao(
        id: string,
        organizacaoId: string,
    ) {
        const solicitacao = await this.prisma.solicitacao.findFirst({
            where: {
                id,
                organizacaoId,
            },

            include: {
                tutor: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                            },
                        },
                    },
                },

                animal: true,

                servico: true,

                historicos: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },

                agendamentos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!solicitacao) {
            throw new NotFoundException('Solicitação não encontrada.');
        }

        return solicitacao;
    }


    async decidirSolicitacao(
        id: string,
        organizacaoId: string,
        administradorId: string,
        dto: DecideSolicitationDto,
    ) {
        const observacao = dto.observacao?.trim() || null;

        if (dto.status === 'RECUSADA' && !observacao) {
            throw new BadRequestException(
                'É obrigatório informar uma justificativa para recusar a solicitação.',
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const solicitacao = await tx.solicitacao.findFirst({
                where: {
                    id,
                    organizacaoId,
                },
                select: {
                    id: true,
                    status: true,
                },
            });

            if (!solicitacao) {
                throw new NotFoundException('Solicitação não encontrada.');
            }

            const statusPermitidos: StatusSolicitacao[] = [
                StatusSolicitacao.PENDENTE,
                StatusSolicitacao.EM_ANALISE,
            ];

            if (!statusPermitidos.includes(solicitacao.status)) {
                throw new BadRequestException(
                    'Esta solicitação não pode mais ser aprovada ou recusada.',
                );
            }

            const atualizacao = await tx.solicitacao.updateMany({
                where: {
                    id,
                    organizacaoId,
                    status: {
                        in: statusPermitidos,
                    },
                },
                data: {
                    status: dto.status,
                    observacoesAnalise: observacao,
                    analisadoPorId: administradorId,
                    analisadoEm: new Date(),
                },
            });

            if (atualizacao.count === 0) {
                throw new BadRequestException(
                    'Esta solicitação já foi analisada por outro administrador.',
                );
            }

            await tx.historicoSolicitacao.create({
                data: {
                    solicitacaoId: id,
                    statusAnterior: solicitacao.status,
                    statusNovo: dto.status,
                    observacao,
                    alteradoPorId: administradorId,
                },
            });

            return tx.solicitacao.findFirst({
                where: {
                    id,
                    organizacaoId,
                },
                include: {
                    tutor: {
                        include: {
                            usuario: {
                                select: {
                                    id: true,
                                    nome: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    animal: true,
                    servico: true,
                    historicos: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                    agendamentos: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },
            });
        });
    }


    async listarServicos(organizacaoId: string) {
        return this.prisma.servico.findMany({
            where: {
                organizacaoId,
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
