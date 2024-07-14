/*
  Warnings:

  - You are about to drop the column `image` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdditionalService" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "image",
ADD COLUMN     "price" TEXT;

-- AlterTable
ALTER TABLE "Formation" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
