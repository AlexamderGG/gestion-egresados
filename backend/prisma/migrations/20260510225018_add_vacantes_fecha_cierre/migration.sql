-- AlterTable
ALTER TABLE "ofertas" ADD COLUMN     "vacantes" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "vacantes_cubiertas" INTEGER NOT NULL DEFAULT 0;
