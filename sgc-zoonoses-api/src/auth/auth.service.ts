
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';

import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterTutorDto } from './dto/register-tutor.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { EmailService } from './email.service.js';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto.js';
import { CloudinaryService } from '../storage/cloudinary.service.js';
import type { UploadedImage } from '../storage/cloudinary.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async registerTutor(dto: RegisterTutorDto) {
    const email = dto.email.trim().toLowerCase();
    const cpf = dto.cpf.replace(/\D/g, '');

    // Valida a data de nascimento.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dto.dataNascimento)) {
      throw new BadRequestException(
        'Data de nascimento inválida. Utilize o formato YYYY-MM-DD.',
      );
    }

    const dataNascimento = new Date(
      `${dto.dataNascimento}T00:00:00.000Z`,
    );

    if (
      Number.isNaN(dataNascimento.getTime()) ||
      dataNascimento.toISOString().slice(0, 10) !== dto.dataNascimento
    ) {
      throw new BadRequestException('Data de nascimento inválida.');
    }

    if (dataNascimento > new Date()) {
      throw new BadRequestException(
        'A data de nascimento não pode ser futura.',
      );
    }

    // Localiza a organização de Cajazeiras.
    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: {
        id: true,
        ativa: true,
      },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new BadRequestException(
        'Não foi possível realizar o cadastro neste momento.',
      );
    }

    // Verifica se o e-mail já está cadastrado.
    const emailExistente = await this.prisma.usuario.findUnique({
      where: {
        organizacaoId_email: {
          organizacaoId: organizacao.id,
          email,
        },
      },
    });

    if (emailExistente) {
      throw new ConflictException(
        'Este e-mail já está cadastrado.',
      );
    }

    // Verifica se o CPF já está cadastrado.
    const cpfExistente = await this.prisma.tutor.findFirst({
      where: {
        organizacaoId: organizacao.id,
        cpf,
      },
    });

    if (cpfExistente) {
      throw new ConflictException(
        'Este CPF já está cadastrado.',
      );
    }

    // Criptografa a senha.
    const senhaHash = await bcrypt.hash(dto.password, 10);

    // Gera um código numérico de seis dígitos.
    const codigo = randomInt(100000, 1000000).toString();

    // Armazena somente o hash do código.
    const codigoHash = await bcrypt.hash(codigo, 10);

    const expiraEm = new Date(Date.now() + 10 * 60 * 1000);

    let codigoCriado: { id: string };

    try {
      codigoCriado = await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
          data: {
            organizacaoId: organizacao.id,
            nome: dto.nome.trim(),
            email,
            senhaHash,
            papel: 'TUTOR',
            ativo: true,
          },
        });

        await tx.tutor.create({
          data: {
            organizacaoId: organizacao.id,
            usuarioId: usuario.id,
            cpf,
            dataNascimento,
            telefone: dto.telefone.trim(),
            endereco: dto.endereco.trim(),
            numero: dto.numero.trim(),
            bairro: dto.bairro.trim(),
            cidade: dto.cidade.trim(),
            cep: dto.cep,
          },
        });

        return await tx.codigoVerificacao.create({
          data: {
            usuarioId: usuario.id,
            finalidade: 'VERIFICACAO_EMAIL',
            codigoHash,
            expiraEm,
          },
          select: {
            id: true,
          },
        });
      });
    } catch (error) {
      // Trata conflitos causados por cadastros simultâneos.
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um cadastro com os dados informados.',
        );
      }

      throw error;
    }

    // Envia o código para o e-mail informado.
    try {
      await this.emailService.enviarCodigoVerificacao(email, codigo);
    } catch (error) {
      await this.prisma.codigoVerificacao.update({
        where: { id: codigoCriado.id },
        data: { invalidadoEm: new Date() },
      });

      throw error;
    }

    return {
      message:
        'Cadastro realizado. Enviamos um código de verificação para seu e-mail.',
      email,
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const email = dto.email.trim().toLowerCase();

    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: { id: true, ativa: true },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new BadRequestException('Não foi possível verificar o e-mail.');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        organizacaoId_email: {
          organizacaoId: organizacao.id,
          email,
        },
      },
      select: {
        id: true,
        papel: true,
        emailVerificadoEm: true,
      },
    });

    if (!usuario || usuario.papel !== 'TUTOR') {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    if (usuario.emailVerificadoEm) {
      return {
        message: 'Este e-mail já foi verificado.',
      };
    }

    const agora = new Date();

    const registro = await this.prisma.codigoVerificacao.findFirst({
      where: {
        usuarioId: usuario.id,
        finalidade: 'VERIFICACAO_EMAIL',
        utilizadoEm: null,
        invalidadoEm: null,
        expiraEm: { gt: agora },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!registro || registro.tentativas >= 5) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    const codigoValido = await bcrypt.compare(
      dto.codigo,
      registro.codigoHash,
    );

    if (!codigoValido) {
      const novasTentativas = registro.tentativas + 1;

      await this.prisma.codigoVerificacao.update({
        where: { id: registro.id },
        data: {
          tentativas: { increment: 1 },
          ...(novasTentativas >= 5
            ? { invalidadoEm: agora }
            : {}),
        },
      });

      throw new BadRequestException('Código inválido ou expirado.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: usuario.id },
        data: { emailVerificadoEm: agora },
      });

      await tx.codigoVerificacao.update({
        where: { id: registro.id },
        data: { utilizadoEm: agora },
      });

      await tx.codigoVerificacao.updateMany({
        where: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
          id: { not: registro.id },
          utilizadoEm: null,
          invalidadoEm: null,
        },
        data: { invalidadoEm: agora },
      });
    });

    return {
      message: 'E-mail verificado com sucesso! Você já pode acessar sua conta.',
    };
  }

  async resendVerification(dto: ResendVerificationDto) {
    const email = dto.email.trim().toLowerCase();

    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: { id: true, ativa: true },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new BadRequestException(
        'Não foi possível realizar a operação.',
      );
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        organizacaoId_email: {
          organizacaoId: organizacao.id,
          email,
        },
      },
      select: {
        id: true,
        papel: true,
        emailVerificadoEm: true,
      },
    });

    if (!usuario || usuario.papel !== 'TUTOR') {
      throw new BadRequestException(
        'Não foi possível realizar a operação.',
      );
    }

    if (usuario.emailVerificadoEm) {
      throw new BadRequestException(
        'Este e-mail já foi verificado.',
      );
    }

    const agora = new Date();
    const umaHoraAtras = new Date(
      agora.getTime() - 60 * 60 * 1000,
    );

    const codigosRecentes =
      await this.prisma.codigoVerificacao.count({
        where: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
          createdAt: { gte: umaHoraAtras },
        },
      });

    if (codigosRecentes >= 5) {
      throw new BadRequestException(
        'Limite de reenvios atingido. Tente novamente mais tarde.',
      );
    }

    const ultimoCodigo =
      await this.prisma.codigoVerificacao.findFirst({
        where: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
        },
        orderBy: { createdAt: 'desc' },
      });

    if (
      ultimoCodigo &&
      agora.getTime() - ultimoCodigo.createdAt.getTime() <
      60 * 1000
    ) {
      throw new BadRequestException(
        'Aguarde um minuto antes de solicitar outro código.',
      );
    }

    const codigo = randomInt(100000, 1000000).toString();
    const codigoHash = await bcrypt.hash(codigo, 10);

    const expiraEm = new Date(
      agora.getTime() + 10 * 60 * 1000,
    );

    const novoCodigo = await this.prisma.$transaction(async (tx) => {
      await tx.codigoVerificacao.updateMany({
        where: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
          utilizadoEm: null,
          invalidadoEm: null,
        },
        data: {
          invalidadoEm: agora,
        },
      });

      return await tx.codigoVerificacao.create({
        data: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
          codigoHash,
          expiraEm,
        },
        select: {
          id: true,
        },
      });
    });

    // Envia o novo código por e-mail.
    try {
      await this.emailService.enviarCodigoVerificacao(email, codigo);
    } catch (error) {
      await this.prisma.codigoVerificacao.update({
        where: { id: novoCodigo.id },
        data: { invalidadoEm: new Date() },
      });

      throw error;
    }

    return {
      message: 'Um novo código de verificação foi enviado para seu e-mail.',
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // Por enquanto, o login pertence à organização de Cajazeiras.
    const organizacao = await this.prisma.organizacao.findUnique({
      where: { slug: 'cajazeiras-pb' },
      select: {
        id: true,
        ativa: true,
      },
    });

    if (!organizacao || !organizacao.ativa) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        organizacaoId_email: {
          organizacaoId: organizacao.id,
          email,
        },
      },
      select: {
        id: true,
        organizacaoId: true,
        nome: true,
        email: true,
        senhaHash: true,
        papel: true,
        ativo: true,
        emailVerificadoEm: true,
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(
      dto.password,
      usuario.senhaHash,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // Exige verificação de e-mail somente para tutores.
    // ADMIN e EQUIPE continuam com o comportamento anterior.
    if (
      usuario.papel === 'TUTOR' &&
      !usuario.emailVerificadoEm
    ) {
      throw new UnauthorizedException(
        'Verifique seu e-mail antes de acessar sua conta.',
      );
    }

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcessoEm: new Date() },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      organizacaoId: usuario.organizacaoId,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  }

  async getTutorProfile(usuarioId: string, organizacaoId: string) {
    const tutor = await this.prisma.tutor.findFirst({
      where: {
        usuarioId,
        organizacaoId,
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
      },
    });

    if (!tutor) {
      throw new UnauthorizedException(
        'Perfil de tutor não encontrado.',
      );
    }

    return tutor;
  }

  async updateTutorProfile(
    usuarioId: string,
    organizacaoId: string,
    dto: UpdateTutorProfileDto,
  ) {
    const campos = [
      dto.nome,
      dto.telefone,
      dto.endereco,
      dto.numero,
      dto.bairro,
      dto.cidade,
      dto.cep,
    ];

    if (campos.every((campo) => campo === undefined)) {
      throw new BadRequestException(
        'Informe pelo menos um campo para atualizar.',
      );
    }

    for (const campo of campos) {
      if (campo !== undefined && campo.trim() === '') {
        throw new BadRequestException(
          'Os campos informados não podem ficar vazios.',
        );
      }
    }

    const tutor = await this.prisma.tutor.findFirst({
      where: {
        usuarioId,
        organizacaoId,
        usuario: {
          is: {
            papel: 'TUTOR',
            ativo: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!tutor) {
      throw new UnauthorizedException(
        'Perfil de tutor não encontrado.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.nome !== undefined) {
        await tx.usuario.update({
          where: {
            id: usuarioId,
          },
          data: {
            nome: dto.nome.trim(),
          },
        });
      }

      await tx.tutor.update({
        where: {
          id: tutor.id,
        },
        data: {
          ...(dto.telefone !== undefined && {
            telefone: dto.telefone.trim(),
          }),
          ...(dto.endereco !== undefined && {
            endereco: dto.endereco.trim(),
          }),
          ...(dto.numero !== undefined && {
            numero: dto.numero.trim(),
          }),
          ...(dto.bairro !== undefined && {
            bairro: dto.bairro.trim(),
          }),
          ...(dto.cidade !== undefined && {
            cidade: dto.cidade.trim(),
          }),
          ...(dto.cep !== undefined && {
            cep: dto.cep.trim(),
          }),
        },
      });
    });

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
      },
    });

    const tutorAtualizado = await this.getTutorProfile(
      usuarioId,
      organizacaoId,
    );

    return {
      usuario,
      tutor: tutorAtualizado,
    };
  }

  async getTutorProfilePhoto(
    usuarioId: string,
    organizacaoId: string,
  ) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        organizacaoId,
        papel: 'TUTOR',
        ativo: true,
      },
      select: {
        fotoPerfilUrl: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    return usuario.fotoPerfilUrl;
  }

  async uploadTutorProfilePhoto(
    usuarioId: string,
    organizacaoId: string,
    file: UploadedImage,
  ) {
    if (!file) {
      throw new BadRequestException('Selecione uma imagem.');
    }

    const usuario = await this.prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        organizacaoId,
        papel: 'TUTOR',
        ativo: true,
      },
      select: {
        id: true,
        fotoPerfilPublicId: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const resultado = await this.cloudinaryService.uploadImage(
      file,
      `sgc-zoonoses/${organizacaoId}/profiles`,
    );

    try {
      await this.prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          fotoPerfilUrl: resultado.secure_url,
          fotoPerfilPublicId: resultado.public_id,
        },
      });
    } catch (error) {
      // Se o banco falhar, tenta remover a imagem recém-enviada.
      try {
        await this.cloudinaryService.deleteImage(resultado.public_id);
      } catch (erroExclusao) {
        console.error(
          'Não foi possível remover a imagem após falha no banco:',
          erroExclusao,
        );
      }

      throw error;
    }

    // Após salvar a nova foto, remove a anterior.
    if (
      usuario.fotoPerfilPublicId &&
      usuario.fotoPerfilPublicId !== resultado.public_id
    ) {
      try {
        await this.cloudinaryService.deleteImage(
          usuario.fotoPerfilPublicId,
        );
      } catch (error) {
        console.error(
          'Não foi possível excluir a foto de perfil anterior:',
          error,
        );
      }
    }

    return {
      message: 'Foto de perfil atualizada com sucesso.',
      fotoPerfilUrl: resultado.secure_url,
    };
  }

  async removeTutorProfilePhoto(
    usuarioId: string,
    organizacaoId: string,
  ) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        organizacaoId,
        papel: 'TUTOR',
        ativo: true,
      },
      select: {
        id: true,
        fotoPerfilPublicId: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (!usuario.fotoPerfilPublicId) {
      return {
        message: 'O usuário não possui foto de perfil.',
        fotoPerfilUrl: null,
      };
    }

    await this.prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        fotoPerfilUrl: null,
        fotoPerfilPublicId: null,
      },
    });

    try {
      await this.cloudinaryService.deleteImage(
        usuario.fotoPerfilPublicId,
      );
    } catch (error) {
      console.error(
        'Não foi possível excluir a foto do Cloudinary:',
        error,
      );
    }

    return {
      message: 'Foto de perfil removida com sucesso.',
      fotoPerfilUrl: null,
    };
  }
}
