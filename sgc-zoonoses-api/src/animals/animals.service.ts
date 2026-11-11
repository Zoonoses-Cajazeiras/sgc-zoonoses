
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../storage/cloudinary.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';

interface AuthenticatedUser {
  id: string;
  organizacaoId: string;
  papel: string;
}

@Injectable()
export class AnimalsService {
  private readonly logger = new Logger(AnimalsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
      select: { id: true },
    });

    if (!tutor) {
      throw new NotFoundException('Perfil de tutor não encontrado.');
    }

    return tutor;
  }

  // A exclusão no Cloudinary não deve desfazer uma operação
  // que já foi concluída com sucesso no banco.
  private async excluirFotoCloudinary(publicId: string | null) {
    if (!publicId) return;

    try {
      await this.cloudinaryService.deleteImage(publicId);
    } catch (error) {
      this.logger.warn(
        `Não foi possível excluir a imagem ${publicId} do Cloudinary.`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async create(dto: CreateAnimalDto, usuario: AuthenticatedUser) {
    const tutor = await this.buscarTutor(usuario);

    if (dto.dataNascimento && dto.idadeAproximadaMeses !== undefined) {
      throw new BadRequestException(
        'Informe a data de nascimento ou a idade aproximada, não ambos.',
      );
    }

    if (Boolean(dto.fotoUrl) !== Boolean(dto.fotoPublicId)) {
      throw new BadRequestException(
        'A URL e o identificador da foto devem ser informados juntos.',
      );
    }

    return this.prisma.animal.create({
      data: {
        organizacaoId: usuario.organizacaoId,
        tutorId: tutor.id,
        nome: dto.nome.trim(),
        especie: dto.especie,
        sexo: dto.sexo,
        raca: dto.raca?.trim() || null,
        cor: dto.cor?.trim() || null,
        porte: dto.porte,
        dataNascimento: dto.dataNascimento
          ? new Date(`${dto.dataNascimento}T00:00:00.000Z`)
          : null,
        idadeAproximadaMeses: dto.idadeAproximadaMeses,
        fotoUrl: dto.fotoUrl?.trim() || null,
        fotoPublicId: dto.fotoPublicId?.trim() || null,
        observacoes: dto.observacoes?.trim() || null,
      },
    });
  }

  async findMyAnimals(usuario: AuthenticatedUser) {
    const tutor = await this.buscarTutor(usuario);

    return this.prisma.animal.findMany({
      where: {
        tutorId: tutor.id,
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    dto: UpdateAnimalDto,
    usuario: AuthenticatedUser,
  ) {
    const tutor = await this.buscarTutor(usuario);

    const animal = await this.prisma.animal.findFirst({
      where: {
        id,
        tutorId: tutor.id,
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado.');
    }

    const enviouUrl = dto.fotoUrl !== undefined;
    const enviouPublicId = dto.fotoPublicId !== undefined;

    if (enviouUrl !== enviouPublicId) {
      throw new BadRequestException(
        'A URL e o identificador da foto devem ser atualizados juntos.',
      );
    }

    const dataNascimento =
      dto.dataNascimento === undefined
        ? animal.dataNascimento
        : dto.dataNascimento === null
          ? null
          : new Date(`${dto.dataNascimento}T00:00:00.000Z`);

    const idadeAproximadaMeses =
      dto.idadeAproximadaMeses === undefined
        ? animal.idadeAproximadaMeses
        : dto.idadeAproximadaMeses;

    if (dataNascimento && idadeAproximadaMeses !== null) {
      throw new BadRequestException(
        'Informe a data de nascimento ou a idade aproximada, não ambos.',
      );
    }

    const animalAtualizado = await this.prisma.animal.update({
      where: { id },
      data: {
        ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
        ...(dto.especie !== undefined && { especie: dto.especie }),
        ...(dto.sexo !== undefined && { sexo: dto.sexo }),
        ...(dto.raca !== undefined && {
          raca: dto.raca?.trim() || null,
        }),
        ...(dto.cor !== undefined && {
          cor: dto.cor?.trim() || null,
        }),
        ...(dto.porte !== undefined && { porte: dto.porte }),
        ...(dto.dataNascimento !== undefined && {
          dataNascimento,
        }),
        ...(dto.idadeAproximadaMeses !== undefined && {
          idadeAproximadaMeses,
        }),
        ...(dto.fotoUrl !== undefined && {
          fotoUrl: dto.fotoUrl?.trim() || null,
        }),
        ...(dto.fotoPublicId !== undefined && {
          fotoPublicId: dto.fotoPublicId?.trim() || null,
        }),
        ...(dto.observacoes !== undefined && {
          observacoes: dto.observacoes?.trim() || null,
        }),
      },
    });

    // A foto antiga só é excluída depois que o banco salva a nova.
    if (
      enviouPublicId &&
      animal.fotoPublicId &&
      animal.fotoPublicId !== animalAtualizado.fotoPublicId
    ) {
      await this.excluirFotoCloudinary(animal.fotoPublicId);
    }

    return animalAtualizado;
  }

  async remove(id: string, usuario: AuthenticatedUser) {
    const tutor = await this.buscarTutor(usuario);

    const animal = await this.prisma.animal.findFirst({
      where: {
        id,
        tutorId: tutor.id,
        organizacaoId: usuario.organizacaoId,
        ativo: true,
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado.');
    }

    const animalRemovido = await this.prisma.animal.update({
      where: { id },
      data: {
        ativo: false,
        fotoUrl: null,
        fotoPublicId: null,
      },
    });

    await this.excluirFotoCloudinary(animal.fotoPublicId);

    return animalRemovido;
  }
}
