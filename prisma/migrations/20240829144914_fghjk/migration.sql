/*
  Warnings:

  - Added the required column `dateOfRdv` to the `ReservationServicePro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservationServicePro" ADD COLUMN     "dateOfRdv" TEXT NOT NULL;
