/*
  Warnings:

  - Changed the type of `functions` on the `Abonnement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Abonnement" DROP COLUMN "functions",
ADD COLUMN     "functions" JSONB NOT NULL;
