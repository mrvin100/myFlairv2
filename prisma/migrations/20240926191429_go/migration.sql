/*
  Warnings:

  - Changed the type of `dates` on the `Formation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Formation" DROP COLUMN "dates",
ADD COLUMN     "dates" JSONB NOT NULL;
