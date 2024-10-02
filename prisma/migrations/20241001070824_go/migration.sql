/*
  Warnings:

  - Added the required column `freePeriod` to the `Abonnement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Abonnement" ADD COLUMN     "freePeriod" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "boosterDates" JSONB,
ADD COLUMN     "formationDates" JSONB;
