-- AlterTable
ALTER TABLE "User" ALTER COLUMN "preferences" DROP NOT NULL,
ALTER COLUMN "biography" DROP NOT NULL,
ALTER COLUMN "mark" DROP NOT NULL,
ALTER COLUMN "numberOfRate" DROP NOT NULL,
ALTER COLUMN "preferencesProWeek" DROP NOT NULL,
ALTER COLUMN "socialMedia" DROP NOT NULL;