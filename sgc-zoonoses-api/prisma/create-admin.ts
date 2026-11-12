
import 'dotenv/config';

import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida no arquivo .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const nome = process.env.INITIAL_ADMIN_NAME?.trim();
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.INITIAL_ADMIN_PASSWORD;

  if (!nome || !email || !senha) {
    throw new Error(
      'Defina INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD no .env.',
    );
  }

  if (senha.length < 14) {
    throw new Error(
      'A senha inicial deve possuir pelo menos 14 caracteres.',
    );
  }

  const organizacao = await prisma.organizacao.findUnique({
    where: { slug: 'cajazeiras-pb' },
    select: { id: true, ativa: true },
  });

  if (!organizacao || !organizacao.ativa) {
    throw new Error(
      'Organização de Cajazeiras não encontrada ou inativa. Execute os dados iniciais primeiro.',
    );
  }

  const existente = await prisma.usuario.findUnique({
    where: {
      organizacaoId_email: {
        organizacaoId: organizacao.id,
        email,
      },
    },
    select: { id: true },
  });

  if (existente) {
    throw new Error(
      'Já existe uma conta com esse e-mail nesta organização. Nenhuma senha foi alterada.',
    );
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  const administrador = await prisma.usuario.create({
    data: {
      organizacaoId: organizacao.id,
      nome,
      email,
      senhaHash,
      papel: 'ADMIN',
      ativo: true,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
    },
  });

  console.log('Administrador criado com sucesso.');
  console.log({
    id: administrador.id,
    nome: administrador.nome,
    email: administrador.email,
    papel: administrador.papel,
  });
}

main()
  .catch((erro: unknown) => {
    console.error('Erro ao criar o administrador:', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
