/*
  Warnings:

  - Added the required column `dates` to the `Formation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "dates" JSONB NOT NULL;
