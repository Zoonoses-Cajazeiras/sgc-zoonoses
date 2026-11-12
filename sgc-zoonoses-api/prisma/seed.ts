import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida no arquivo .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const organizacao = await prisma.organizacao.upsert({
    where: { slug: 'cajazeiras-pb' },
    update: {},
    create: {
      nome: 'Núcleo de Zoonoses de Cajazeiras',
      slug: 'cajazeiras-pb',
      tipo: 'PREFEITURA',
      ativa: true,
    },
  });

  console.log('Organização pronta:', organizacao.nome);

  const servicos = [
    'Castração',
    'Vacinação',
    'Atendimento veterinário',
    'Outros procedimentos',
  ];

  await prisma.servico.createMany({
    data: servicos.map((nome) => ({
      organizacaoId: organizacao.id,
      nome,
    })),
    skipDuplicates: true,
  });

  console.log('Catálogo de serviços preparado.');

  const tiposOcorrencia = [
    'Animal abandonado',
    'Animal encontrado',
    'Animal atropelado',
    'Animal em situação de risco',
    'Animal agressivo',
    'Suspeita de zoonose',
    'Animal doente',
    'Denúncia',
    'Acúmulo de animais',
    'Outras situações',
  ];

  await prisma.tipoOcorrencia.createMany({
    data: tiposOcorrencia.map((nome) => ({
      organizacaoId: organizacao.id,
      nome,
    })),
    skipDuplicates: true,
  });

  console.log('Tipos de ocorrência preparados.');

  await prisma.impactStats.upsert({
    where: { organizacaoId: organizacao.id },
    update: {},
    create: {
      organizacaoId: organizacao.id,
      vaccinated: 0,
      castrations: 0,
      tests: 0,
      sheltered: 0,
      citizens: 0,
    },
  });

  console.log('Indicadores de impacto preparados.');
}

main()
  .catch((erro: unknown) => {
    console.error('Erro ao preparar os dados iniciais:', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
