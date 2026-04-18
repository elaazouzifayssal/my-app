/*
  Warnings:

  - You are about to drop the column `userId` on the `Habit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "userId",
ADD COLUMN     "clerkUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
