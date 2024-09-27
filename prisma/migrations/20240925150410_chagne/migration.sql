/*
  Warnings:

  - You are about to drop the column `preferencesProWeek` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[preferencesProWeekId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `dates` on the `BusinessBooster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AdditionalService" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "BusinessBooster" ADD COLUMN     "orderId" TEXT,
DROP COLUMN "dates",
ADD COLUMN     "dates" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferencesProWeek",
ADD COLUMN     "preferencesProWeekId" TEXT;

-- CreateTable
CREATE TABLE "PreferencesProWeek" (
    "id" TEXT NOT NULL,
    "availabilities" JSONB,
    "availabilitiesPeriods" JSONB,

    CONSTRAINT "PreferencesProWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_preferencesProWeekId_key" ON "User"("preferencesProWeekId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_preferencesProWeekId_fkey" FOREIGN KEY ("preferencesProWeekId") REFERENCES "PreferencesProWeek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalService" ADD CONSTRAINT "AdditionalService_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBooster" ADD CONSTRAINT "BusinessBooster_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
