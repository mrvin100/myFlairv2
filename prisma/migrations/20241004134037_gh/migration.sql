-- AlterTable
ALTER TABLE "ReservationServicePro" ADD COLUMN     "hiddenForPro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hiddenForUser" BOOLEAN NOT NULL DEFAULT false;
