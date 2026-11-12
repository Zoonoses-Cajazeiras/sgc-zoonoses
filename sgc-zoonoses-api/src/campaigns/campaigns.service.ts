
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { StatusCampanha } from '../generated/prisma/enums.js';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) { }

  // Lista somente as campanhas ativas para o público.
  async findPublic() {
    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: { id: true, ativa: true },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new NotFoundException('Organização não encontrada.');
    }

    const campaigns = await this.prisma.campaign.findMany({
      where: {
        organizacaoId: organizacao.id,
        status: 'ATIVA',
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        schedule: true,
        location: true,
        buttonText: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      status: campaign.status.toLowerCase(),
      schedule: campaign.schedule,
      location: campaign.location,
      buttonText: campaign.buttonText,
      createdBy: campaign.createdById,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    }));
  }

  // Cadastra uma campanha.
  async create(
    dto: CreateCampaignDto,
    organizacaoId: string,
    usuarioId: string,
  ) {
    const statusMap: Record<
      CreateCampaignDto['status'],
      StatusCampanha
    > = {
      ativa: StatusCampanha.ATIVA,
      encerrada: StatusCampanha.ENCERRADA,
      rascunho: StatusCampanha.RASCUNHO,
    };

    const campaign = await this.prisma.campaign.create({
      data: {
        organizacaoId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        status: statusMap[dto.status],
        schedule: dto.schedule?.trim() || null,
        location: dto.location?.trim() || null,
        buttonText: dto.buttonText?.trim() || 'Saiba mais',
        createdById: usuarioId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        schedule: true,
        location: true,
        buttonText: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      status: campaign.status.toLowerCase(),
      schedule: campaign.schedule,
      location: campaign.location,
      buttonText: campaign.buttonText,
      createdBy: campaign.createdById,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
  }

//atualiza uma campanha
  async update(
    id: string,
    organizacaoId: string,
    dto: UpdateCampaignDto,
  ) {
    const statusMap: Record<
      NonNullable<UpdateCampaignDto['status']>,
      StatusCampanha
    > = {
      ativa: StatusCampanha.ATIVA,
      encerrada: StatusCampanha.ENCERRADA,
      rascunho: StatusCampanha.RASCUNHO,
    };

    const data = {
      ...(dto.title !== undefined && {
        title: dto.title.trim(),
      }),
      ...(dto.description !== undefined && {
        description: dto.description.trim(),
      }),
      ...(dto.status !== undefined && {
        status: statusMap[dto.status],
      }),
      ...(dto.schedule !== undefined && {
        schedule: dto.schedule?.trim() || null,
      }),
      ...(dto.location !== undefined && {
        location: dto.location?.trim() || null,
      }),
      ...(dto.buttonText !== undefined && {
        buttonText: dto.buttonText.trim() || 'Saiba mais',
      }),
    };

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Informe pelo menos um campo para atualizar.',
      );
    }

    const resultado = await this.prisma.campaign.updateMany({
      where: {
        id,
        organizacaoId,
      },
      data,
    });

    if (resultado.count === 0) {
      throw new NotFoundException(
        'Campanha não encontrada nesta organização.',
      );
    }

    const campaign = await this.prisma.campaign.findFirstOrThrow({
      where: {
        id,
        organizacaoId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        schedule: true,
        location: true,
        buttonText: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      status: campaign.status.toLowerCase(),
      schedule: campaign.schedule,
      location: campaign.location,
      buttonText: campaign.buttonText,
      createdBy: campaign.createdById,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
  }



  //deleta uma campanha
  async remove(id: string, organizacaoId: string) {
    const resultado = await this.prisma.campaign.deleteMany({
      where: {
        id,
        organizacaoId,
      },
    });

    if (resultado.count === 0) {
      throw new NotFoundException(
        'Campanha não encontrada nesta organização.',
      );
    }

    return {
      message: 'Campanha excluída com sucesso.',
    };
  }

  
async findAllForAdmin(organizacaoId: string) {
  const campaigns = await this.prisma.campaign.findMany({
    where: {
      organizacaoId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      schedule: true,
      location: true,
      buttonText: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    status: campaign.status.toLowerCase(),
    schedule: campaign.schedule,
    location: campaign.location,
    buttonText: campaign.buttonText,
    createdBy: campaign.createdById,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  }));
}



}
