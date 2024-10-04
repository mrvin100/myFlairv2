-- DropForeignKey
ALTER TABLE "ReservationServicePro" DROP CONSTRAINT "ReservationServicePro_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ReservationServicePro" DROP CONSTRAINT "ReservationServicePro_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ReservationServicePro" DROP CONSTRAINT "ReservationServicePro_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ReservationServicePro" ADD CONSTRAINT "ReservationServicePro_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationServicePro" ADD CONSTRAINT "ReservationServicePro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationServicePro" ADD CONSTRAINT "ReservationServicePro_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
