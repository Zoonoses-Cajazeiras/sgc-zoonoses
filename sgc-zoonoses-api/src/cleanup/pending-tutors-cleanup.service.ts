
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  Cron,
  CronExpression,
} from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PendingTutorsCleanupService {
  private readonly logger = new Logger(
    PendingTutorsCleanupService.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async limparCadastrosPendentes() {
    const limite = new Date();
    limite.setHours(limite.getHours() - 24);

    try {
      const candidatos = await this.prisma.usuario.findMany({
        where: {
          papel: 'TUTOR',
          emailVerificadoEm: null,
          createdAt: {
            lt: limite,
          },
          tutor: {
            is: {
              animais: {
                none: {},
              },
              solicitacoes: {
                none: {},
              },
              ocorrencias: {
                none: {},
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      let removidos = 0;

      for (const candidato of candidatos) {
        await this.prisma.$transaction(async (tx) => {
          const usuario = await tx.usuario.findFirst({
            where: {
              id: candidato.id,
              papel: 'TUTOR',
              emailVerificadoEm: null,
              createdAt: {
                lt: limite,
              },
              tutor: {
                is: {
                  animais: { none: {} },
                  solicitacoes: { none: {} },
                  ocorrencias: { none: {} },
                },
              },
            },
            select: {
              id: true,
              tutor: {
                select: {
                  id: true,
                },
              },
            },
          });

          if (!usuario || !usuario.tutor) {
            return;
          }

          await tx.tutor.delete({
            where: {
              id: usuario.tutor.id,
            },
          });

          await tx.usuario.delete({
            where: {
              id: usuario.id,
            },
          });

          removidos++;
        }, {
          isolationLevel: 'Serializable',
        });
      }

      if (removidos > 0) {
        this.logger.log(
          `${removidos} cadastro(s) pendente(s) removido(s).`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Erro ao limpar cadastros pendentes de verificação.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
