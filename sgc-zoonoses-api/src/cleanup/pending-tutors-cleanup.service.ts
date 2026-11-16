
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import {
  Cron,
  CronExpression,
} from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PendingTutorsCleanupService
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    PendingTutorsCleanupService.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executa uma limpeza assim que o backend inicia.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(
      'Verificando cadastros pendentes na inicialização...',
    );

    await this.limparCadastrosPendentes();
  }

  /**
   * Continua executando a limpeza a cada hora.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async limparCadastrosPendentes(): Promise<void> {
    try {
      // Considera exatamente 24 horas antes do momento atual.
      const limite = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      );

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
        await this.prisma.$transaction(
          async (tx) => {
            // Confere novamente antes de excluir.
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
          },
          {
            isolationLevel: 'Serializable',
          },
        );
      }

      if (removidos > 0) {
        this.logger.log(
          `${removidos} cadastro(s) pendente(s) removido(s).`,
        );
      } else {
        this.logger.log(
          'Nenhum cadastro pendente elegível para exclusão.',
        );
      }
    } catch (error) {
      this.logger.error(
        'Erro ao limpar cadastros pendentes de verificação.',
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }
}
