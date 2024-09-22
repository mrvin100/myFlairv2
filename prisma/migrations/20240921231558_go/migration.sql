/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "serviceId";
