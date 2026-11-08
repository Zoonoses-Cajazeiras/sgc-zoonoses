
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    try {
      await this.prisma.$transaction(async (tx) => {
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

        await tx.codigoVerificacao.create({
          data: {
            usuarioId: usuario.id,
            finalidade: 'VERIFICACAO_EMAIL',
            codigoHash,
            expiraEm,
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

    return {
      message:
        'Cadastro realizado. A verificação do e-mail será necessária para acessar a conta.',
      email,
      ...(process.env.NODE_ENV !== 'production'
        ? { codigoTeste: codigo }
        : {}),
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

    await this.prisma.$transaction(async (tx) => {
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

      await tx.codigoVerificacao.create({
        data: {
          usuarioId: usuario.id,
          finalidade: 'VERIFICACAO_EMAIL',
          codigoHash,
          expiraEm,
        },
      });
    });

    return {
      message: 'Se os dados forem válidos, um novo código será disponibilizado.',
      ...(process.env.NODE_ENV !== 'production'
        ? { codigoTeste: codigo }
        : {}),
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


}
