/*
  Warnings:

  - Made the column `clerkUserId` on table `Habit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "clerkUserId" SET NOT NULL;
