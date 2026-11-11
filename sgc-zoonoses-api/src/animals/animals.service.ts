
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';

interface AuthenticatedUser {
  id: string;
  organizacaoId: string;
  papel: string;
}

@Injectable()
export class AnimalsService {
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
      select: { id: true },
    });

    if (!tutor) {
      throw new NotFoundException('Perfil de tutor não encontrado.');
    }

    return tutor;
  }

  async create(dto: CreateAnimalDto, usuario: AuthenticatedUser) {
    const tutor = await this.buscarTutor(usuario);

    if (dto.dataNascimento && dto.idadeAproximadaMeses !== undefined) {
      throw new ForbiddenException(
        'Informe a data de nascimento ou a idade aproximada, não ambos.',
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
      throw new ForbiddenException(
        'Informe a data de nascimento ou a idade aproximada, não ambos.',
      );
    }

    return this.prisma.animal.update({
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
        ...(dto.observacoes !== undefined && {
          observacoes: dto.observacoes?.trim() || null,
        }),
      },
    });
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

    return this.prisma.animal.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
