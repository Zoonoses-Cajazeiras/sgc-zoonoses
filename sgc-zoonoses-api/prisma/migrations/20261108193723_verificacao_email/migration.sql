-- CreateEnum
CREATE TYPE "FinalidadeCodigoVerificacao" AS ENUM ('VERIFICACAO_EMAIL', 'RECUPERACAO_SENHA');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "emailVerificadoEm" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "codigos_verificacao" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "finalidade" "FinalidadeCodigoVerificacao" NOT NULL,
    "codigoHash" VARCHAR(255) NOT NULL,
    "expiraEm" TIMESTAMPTZ(6) NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "utilizadoEm" TIMESTAMPTZ(6),
    "invalidadoEm" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigos_verificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "codigos_verificacao_usuarioId_finalidade_createdAt_idx" ON "codigos_verificacao"("usuarioId", "finalidade", "createdAt");

-- CreateIndex
CREATE INDEX "codigos_verificacao_expiraEm_idx" ON "codigos_verificacao"("expiraEm");

-- AddForeignKey
ALTER TABLE "codigos_verificacao" ADD CONSTRAINT "codigos_verificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
