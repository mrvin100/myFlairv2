/*
  Warnings:

  - You are about to drop the column `forfaitSuscribeFreeAvailible` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "forfaitSuscribeFreeAvailible",
ADD COLUMN     "forfaitSubscribeFreeAvailable" BOOLEAN;
