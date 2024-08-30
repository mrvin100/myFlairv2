/*
  Warnings:

  - Added the required column `deposit` to the `Formation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "deposit" DOUBLE PRECISION NOT NULL;
