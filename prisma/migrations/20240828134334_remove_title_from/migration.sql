/*
  Warnings:

  - You are about to drop the column `service` on the `User` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mark` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfRate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferencesProWeek` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialMedia` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessBooster" DROP CONSTRAINT "BusinessBooster_idStripe_fkey";

-- AlterTable
ALTER TABLE "BusinessBooster" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "idStripe" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "postId" INTEGER NOT NULL,
ADD COLUMN     "roomId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "personalId" DROP NOT NULL,
ALTER COLUMN "professionalId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "service",
ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "mark" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "numberOfRate" INTEGER NOT NULL,
ADD COLUMN     "preferencesProWeek" JSONB NOT NULL,
ADD COLUMN     "socialMedia" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessBooster" ADD CONSTRAINT "BusinessBooster_idStripe_fkey" FOREIGN KEY ("idStripe") REFERENCES "Product"("stripeId") ON DELETE SET NULL ON UPDATE CASCADE;
