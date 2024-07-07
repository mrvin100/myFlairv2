/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idStripe]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Made the column `updatedAt` on table `BusinessBooster` required. This step will fail if there are existing NULL values in that column.
  - The required column `stripeId` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- AlterTable
ALTER TABLE "BusinessBooster" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "idStripe" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "imageUrl",
DROP COLUMN "price",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "stripeId" TEXT NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("stripeId");

-- DropTable
DROP TABLE "CartItem";

-- CreateIndex
CREATE UNIQUE INDEX "Post_idStripe_key" ON "Post"("idStripe");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_idStripe_fkey" FOREIGN KEY ("idStripe") REFERENCES "Product"("stripeId") ON DELETE SET NULL ON UPDATE CASCADE;
