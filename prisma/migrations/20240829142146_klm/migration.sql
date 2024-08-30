/*
  Warnings:

  - You are about to drop the column `time` on the `ReservationServicePro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReservationServicePro" DROP COLUMN "time",
ALTER COLUMN "date" SET DATA TYPE TEXT;
