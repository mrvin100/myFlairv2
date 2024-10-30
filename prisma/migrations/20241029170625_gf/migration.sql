/*
  Warnings:

  - The values [MONTHLY,YEARLY] on the enum `SubscriptionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('MONTH', 'YEAR');
ALTER TABLE "User" ALTER COLUMN "subscription" TYPE "SubscriptionType_new" USING ("subscription"::text::"SubscriptionType_new");
ALTER TABLE "Subscription" ALTER COLUMN "type" TYPE "SubscriptionType_new" USING ("type"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "SubscriptionType_old";
COMMIT;
