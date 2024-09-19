/*
  Warnings:

  - You are about to drop the column `userId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_proId_fkey" FOREIGN KEY ("proId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
