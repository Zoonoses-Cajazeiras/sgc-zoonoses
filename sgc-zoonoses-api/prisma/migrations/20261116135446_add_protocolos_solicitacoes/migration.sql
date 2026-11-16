/*
  Warnings:

  - A unique constraint covering the columns `[organizacaoId,protocolo]` on the table `solicitacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "solicitacoes" ADD COLUMN     "protocolo" VARCHAR(30);

-- CreateTable
CREATE TABLE "contadores_protocolos" (
    "id" UUID NOT NULL,
    "organizacaoId" UUID NOT NULL,
    "prefixo" VARCHAR(2) NOT NULL,
    "ano" INTEGER NOT NULL,
    "ultimoNumero" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contadores_protocolos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contadores_protocolos_organizacaoId_prefixo_ano_key" ON "contadores_protocolos"("organizacaoId", "prefixo", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "solicitacoes_organizacaoId_protocolo_key" ON "solicitacoes"("organizacaoId", "protocolo");

-- AddForeignKey
ALTER TABLE "contadores_protocolos" ADD CONSTRAINT "contadores_protocolos_organizacaoId_fkey" FOREIGN KEY ("organizacaoId") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
