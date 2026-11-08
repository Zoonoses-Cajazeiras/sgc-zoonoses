-- CreateEnum
CREATE TYPE "StatusCampanha" AS ENUM ('ATIVA', 'ENCERRADA', 'RASCUNHO');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "organizacao_id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusCampanha" NOT NULL DEFAULT 'RASCUNHO',
    "schedule" VARCHAR(180),
    "location" VARCHAR(180),
    "button_text" VARCHAR(80) NOT NULL DEFAULT 'Saiba mais',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impact_stats" (
    "id" UUID NOT NULL,
    "organizacao_id" UUID NOT NULL,
    "vaccinated" INTEGER NOT NULL DEFAULT 0,
    "castrations" INTEGER NOT NULL DEFAULT 0,
    "tests" INTEGER NOT NULL DEFAULT 0,
    "sheltered" INTEGER NOT NULL DEFAULT 0,
    "citizens" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "impact_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_organizacao_id_status_created_at_idx" ON "campaigns"("organizacao_id", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "impact_stats_organizacao_id_key" ON "impact_stats"("organizacao_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impact_stats" ADD CONSTRAINT "impact_stats_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
