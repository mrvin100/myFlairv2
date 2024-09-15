/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ReservationServicePro` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ReservationServicePro` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReservationServicePro" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "clientId" TEXT;

-- AddForeignKey
ALTER TABLE "ReservationServicePro" ADD CONSTRAINT "ReservationServicePro_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
