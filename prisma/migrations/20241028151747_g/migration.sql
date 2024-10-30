-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('inWork', 'active', 'canceled');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nextBillingDate" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT;
