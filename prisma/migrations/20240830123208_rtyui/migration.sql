/*
  Warnings:

  - Added the required column `comment` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropIndex
DROP INDEX "Review_userId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "comment" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
