/*
  Warnings:

  - Made the column `clientIdTest` on table `ReservationServicePro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReservationServicePro" ALTER COLUMN "clientIdTest" SET NOT NULL;
