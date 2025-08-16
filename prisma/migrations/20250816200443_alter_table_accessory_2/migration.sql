/*
  Warnings:

  - You are about to drop the column `Model` on the `accessory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."accessory" DROP COLUMN "Model",
ADD COLUMN     "model" TEXT;
