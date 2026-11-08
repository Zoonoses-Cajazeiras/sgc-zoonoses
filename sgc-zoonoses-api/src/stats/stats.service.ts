
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateImpactStatsDto } from './dto/update-impact-stats.dto.js';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) { }

  async findPublic() {
    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: { id: true, ativa: true },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new NotFoundException('Organização não encontrada.');
    }

    const stats = await this.prisma.impactStats.findUnique({
      where: {
        organizacaoId: organizacao.id,
      },
      select: {
        id: true,
        vaccinated: true,
        castrations: true,
        tests: true,
        sheltered: true,
        citizens: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!stats) {
      throw new NotFoundException(
        'Indicadores de impacto não encontrados.',
      );
    }

    return stats;
  }

  async update(
    id: string,
    organizacaoId: string,
    dto: UpdateImpactStatsDto,
  ) {
    const resultado = await this.prisma.impactStats.updateMany({
      where: {
        id,
        organizacaoId,
      },
      data: {
        vaccinated: dto.vaccinated,
        castrations: dto.castrations,
        tests: dto.tests,
        sheltered: dto.sheltered,
        citizens: dto.citizens,
      },
    });

    if (resultado.count === 0) {
      throw new NotFoundException(
        'Indicadores não encontrados nesta organização.',
      );
    }

    return this.prisma.impactStats.findFirstOrThrow({
      where: {
        id,
        organizacaoId,
      },
      select: {
        id: true,
        vaccinated: true,
        castrations: true,
        tests: true,
        sheltered: true,
        citizens: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
