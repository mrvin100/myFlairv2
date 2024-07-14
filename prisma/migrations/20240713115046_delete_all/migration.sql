/*
  Warnings:

  - You are about to drop the `AdditionalService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessBooster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Formation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Try` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdditionalService" DROP CONSTRAINT "AdditionalService_idStripe_fkey";

-- DropForeignKey
ALTER TABLE "BusinessBooster" DROP CONSTRAINT "BusinessBooster_idStripe_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_idStripe_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_idStripe_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- DropTable
DROP TABLE "AdditionalService";

-- DropTable
DROP TABLE "BusinessBooster";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Formation";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Reservation";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Test";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "Try";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "ProductType";

-- DropEnum
DROP TYPE "ReservationStatus";

-- DropEnum
DROP TYPE "SubscriptionArgumentType";

-- DropEnum
DROP TYPE "SubscriptionType";

-- DropEnum
DROP TYPE "UserRole";
