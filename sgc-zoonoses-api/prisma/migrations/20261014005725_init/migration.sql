-- CreateEnum
CREATE TYPE "TipoOrganizacao" AS ENUM ('PREFEITURA', 'CLINICA', 'OUTRA');

-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('ADMIN', 'EQUIPE', 'TUTOR');

-- CreateEnum
CREATE TYPE "StatusCadastroTutor" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO');

-- CreateEnum
CREATE TYPE "EspecieAnimal" AS ENUM ('CAO', 'GATO', 'OUTRA');

-- CreateEnum
CREATE TYPE "SexoAnimal" AS ENUM ('MACHO', 'FEMEA', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "PorteAnimal" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'RECUSADA', 'AGENDADA', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusOcorrencia" AS ENUM ('PENDENTE', 'EM_ANALISE', 'EM_ATENDIMENTO', 'EM_ACOMPANHAMENTO', 'RESOLVIDA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU');

-- CreateTable
CREATE TABLE "organizacoes" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "tipo" "TipoOrganizacao" NOT NULL DEFAULT 'PREFEITURA',
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "nome" VARCHAR(160) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "senhaHash" VARCHAR(255) NOT NULL,
    "papel" "PapelUsuario" NOT NULL DEFAULT 'TUTOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcessoEm" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutores" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "telefone" VARCHAR(30) NOT NULL,
    "endereco" VARCHAR(180) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "statusCadastro" "StatusCadastroTutor" NOT NULL DEFAULT 'PENDENTE',
    "motivoRecusa" VARCHAR(500),
    "avaliadoPorId" UUID,
    "avaliadoEm" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animais" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "tutorId" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "especie" "EspecieAnimal" NOT NULL,
    "sexo" "SexoAnimal" NOT NULL DEFAULT 'NAO_INFORMADO',
    "raca" VARCHAR(100),
    "cor" VARCHAR(80),
    "porte" "PorteAnimal" NOT NULL DEFAULT 'NAO_INFORMADO',
    "dataNascimento" DATE,
    "idadeAproximadaMeses" INTEGER,
    "fotoUrl" VARCHAR(1000),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "animais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "tutorId" UUID NOT NULL,
    "animalId" UUID NOT NULL,
    "servicoId" UUID NOT NULL,
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "observacoesAnalise" TEXT,
    "analisadoPorId" UUID,
    "analisadoEm" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historicos_solicitacoes" (
    "id" UUID NOT NULL,
    "solicitacaoId" UUID NOT NULL,
    "statusAnterior" "StatusSolicitacao",
    "statusNovo" "StatusSolicitacao" NOT NULL,
    "observacao" TEXT,
    "alteradoPorId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicos_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_ocorrencia" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tipos_ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "protocolo" VARCHAR(30) NOT NULL,
    "tutorId" UUID NOT NULL,
    "tipoOcorrenciaId" UUID NOT NULL,
    "animalId" UUID,
    "dataOcorrencia" DATE NOT NULL,
    "localReferencia" VARCHAR(180),
    "endereco" VARCHAR(250) NOT NULL,
    "descricao" TEXT NOT NULL,
    "informacoesAdicionais" TEXT,
    "anexoUrl" VARCHAR(1000),
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'PENDENTE',
    "resolvidaEm" TIMESTAMPTZ(6),
    "conclusao" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historicos_ocorrencias" (
    "id" UUID NOT NULL,
    "ocorrenciaId" UUID NOT NULL,
    "statusAnterior" "StatusOcorrencia",
    "statusNovo" "StatusOcorrencia" NOT NULL,
    "observacao" TEXT,
    "alteradoPorId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicos_ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipes" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "equipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recursos" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "tipo" VARCHAR(80) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "solicitacaoId" UUID NOT NULL,
    "equipeId" UUID,
    "responsavelUsuarioId" UUID,
    "recursoId" UUID,
    "inicio" TIMESTAMPTZ(6) NOT NULL,
    "fim" TIMESTAMPTZ(6) NOT NULL,
    "local" VARCHAR(250) NOT NULL,
    "observacoes" TEXT,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',
    "criadoPorId" UUID NOT NULL,
    "canceladoEm" TIMESTAMPTZ(6),
    "motivoCancelamento" VARCHAR(500),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizacoes_slug_key" ON "organizacoes"("slug");

-- CreateIndex
CREATE INDEX "usuarios_organizacaoId_papel_ativo_idx" ON "usuarios"("organizacaoId", "papel", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_organizacaoId_email_key" ON "usuarios"("organizacaoId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "tutores_usuarioId_key" ON "tutores"("usuarioId");

-- CreateIndex
CREATE INDEX "tutores_organizacaoId_statusCadastro_createdAt_idx" ON "tutores"("organizacaoId", "statusCadastro", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tutores_organizacaoId_cpf_key" ON "tutores"("organizacaoId", "cpf");

-- CreateIndex
CREATE INDEX "animais_organizacaoId_tutorId_ativo_idx" ON "animais"("organizacaoId", "tutorId", "ativo");

-- CreateIndex
CREATE INDEX "animais_organizacaoId_especie_sexo_idx" ON "animais"("organizacaoId", "especie", "sexo");

-- CreateIndex
CREATE INDEX "servicos_organizacaoId_ativo_idx" ON "servicos"("organizacaoId", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "servicos_organizacaoId_nome_key" ON "servicos"("organizacaoId", "nome");

-- CreateIndex
CREATE INDEX "solicitacoes_organizacaoId_status_createdAt_idx" ON "solicitacoes"("organizacaoId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "solicitacoes_organizacaoId_tutorId_createdAt_idx" ON "solicitacoes"("organizacaoId", "tutorId", "createdAt");

-- CreateIndex
CREATE INDEX "solicitacoes_organizacaoId_animalId_idx" ON "solicitacoes"("organizacaoId", "animalId");

-- CreateIndex
CREATE INDEX "historicos_solicitacoes_solicitacaoId_createdAt_idx" ON "historicos_solicitacoes"("solicitacaoId", "createdAt");

-- CreateIndex
CREATE INDEX "tipos_ocorrencia_organizacaoId_ativo_idx" ON "tipos_ocorrencia"("organizacaoId", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_ocorrencia_organizacaoId_nome_key" ON "tipos_ocorrencia"("organizacaoId", "nome");

-- CreateIndex
CREATE INDEX "ocorrencias_organizacaoId_status_createdAt_idx" ON "ocorrencias"("organizacaoId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ocorrencias_organizacaoId_tutorId_createdAt_idx" ON "ocorrencias"("organizacaoId", "tutorId", "createdAt");

-- CreateIndex
CREATE INDEX "ocorrencias_organizacaoId_tipoOcorrenciaId_idx" ON "ocorrencias"("organizacaoId", "tipoOcorrenciaId");

-- CreateIndex
CREATE UNIQUE INDEX "ocorrencias_organizacaoId_protocolo_key" ON "ocorrencias"("organizacaoId", "protocolo");

-- CreateIndex
CREATE INDEX "historicos_ocorrencias_ocorrenciaId_createdAt_idx" ON "historicos_ocorrencias"("ocorrenciaId", "createdAt");

-- CreateIndex
CREATE INDEX "equipes_organizacaoId_ativa_idx" ON "equipes"("organizacaoId", "ativa");

-- CreateIndex
CREATE UNIQUE INDEX "equipes_organizacaoId_nome_key" ON "equipes"("organizacaoId", "nome");

-- CreateIndex
CREATE INDEX "recursos_organizacaoId_ativo_idx" ON "recursos"("organizacaoId", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "recursos_organizacaoId_nome_key" ON "recursos"("organizacaoId", "nome");

-- CreateIndex
CREATE INDEX "agendamentos_organizacaoId_inicio_fim_idx" ON "agendamentos"("organizacaoId", "inicio", "fim");

-- CreateIndex
CREATE INDEX "agendamentos_organizacaoId_status_inicio_idx" ON "agendamentos"("organizacaoId", "status", "inicio");

-- CreateIndex
CREATE INDEX "agendamentos_solicitacaoId_status_idx" ON "agendamentos"("solicitacaoId", "status");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_avaliadoPorId_fkey" FOREIGN KEY ("avaliadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animais" ADD CONSTRAINT "animais_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animais" ADD CONSTRAINT "animais_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_analisadoPorId_fkey" FOREIGN KEY ("analisadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_solicitacoes" ADD CONSTRAINT "historicos_solicitacoes_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_solicitacoes" ADD CONSTRAINT "historicos_solicitacoes_alteradoPorId_fkey" FOREIGN KEY ("alteradoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_ocorrencia" ADD CONSTRAINT "tipos_ocorrencia_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_tipoOcorrenciaId_fkey" FOREIGN KEY ("tipoOcorrenciaId") REFERENCES "tipos_ocorrencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_ocorrencias" ADD CONSTRAINT "historicos_ocorrencias_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "ocorrencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_ocorrencias" ADD CONSTRAINT "historicos_ocorrencias_alteradoPorId_fkey" FOREIGN KEY ("alteradoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipes" ADD CONSTRAINT "equipes_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recursos" ADD CONSTRAINT "recursos_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_responsavelUsuarioId_fkey" FOREIGN KEY ("responsavelUsuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_recursoId_fkey" FOREIGN KEY ("recursoId") REFERENCES "recursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
