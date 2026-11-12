
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async listarTutores(
        organizacaoId: string,
        pageParam?: string,
        limitParam?: string,
        searchParam?: string,
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

        const busca = searchParam?.trim();

        const where = {
            organizacaoId,
            usuario: {
                is: {
                    papel: 'TUTOR' as const,
                },
            },
            ...(busca
                ? {
                    OR: [
                        {
                            cpf: {
                                contains: busca.replace(/\D/g, '') || busca,
                            },
                        },
                        {
                            usuario: {
                                is: {
                                    nome: {
                                        contains: busca,
                                        mode: 'insensitive' as const,
                                    },
                                },
                            },
                        },
                        {
                            usuario: {
                                is: {
                                    email: {
                                        contains: busca,
                                        mode: 'insensitive' as const,
                                    },
                                },
                            },
                        },
                    ],
                }
                : {}),
        };

        const [tutores, total] = await this.prisma.$transaction([
            this.prisma.tutor.findMany({
                where,
                select: {
                    id: true,
                    cpf: true,
                    telefone: true,
                    cidade: true,
                    bairro: true,
                    createdAt: true,
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            ativo: true,
                            emailVerificadoEm: true,
                            createdAt: true,
                        },
                    },
                    _count: {
                        select: {
                            animais: {
                                where: {
                                    ativo: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.tutor.count({ where }),
        ]);

        return {
            data: tutores,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async consultarTutor(id: string, organizacaoId: string) {
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                id,
                organizacaoId,
                usuario: {
                    is: {
                        papel: 'TUTOR',
                    },
                },
            },
            select: {
                id: true,
                cpf: true,
                dataNascimento: true,
                telefone: true,
                endereco: true,
                numero: true,
                bairro: true,
                cidade: true,
                cep: true,
                createdAt: true,
                updatedAt: true,

                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        ativo: true,
                        emailVerificadoEm: true,
                        ultimoAcessoEm: true,
                        createdAt: true,
                    },
                },

                animais: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        nome: true,
                        especie: true,
                        sexo: true,
                        raca: true,
                        cor: true,
                        porte: true,
                        dataNascimento: true,
                        idadeAproximadaMeses: true,
                        fotoUrl: true,
                        observacoes: true,
                        ativo: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!tutor) {
            throw new NotFoundException('Tutor não encontrado.');
        }

        return tutor;
    }
}
