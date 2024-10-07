/*
  Warnings:

  - You are about to drop the column `freePeriod` on the `Abonnement` table. All the data in the column will be lost.
  - Made the column `idStripe` on table `BusinessBooster` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BusinessBooster" DROP CONSTRAINT "BusinessBooster_idStripe_fkey";

-- AlterTable
ALTER TABLE "Abonnement" DROP COLUMN "freePeriod";

-- AlterTable
ALTER TABLE "BusinessBooster" ALTER COLUMN "idStripe" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessBooster" ADD CONSTRAINT "BusinessBooster_idStripe_fkey" FOREIGN KEY ("idStripe") REFERENCES "Product"("stripeId") ON DELETE RESTRICT ON UPDATE CASCADE;
