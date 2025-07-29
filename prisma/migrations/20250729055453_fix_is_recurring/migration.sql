/*
  Warnings:

  - You are about to drop the column `isReccurring` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "isReccurring",
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false;
