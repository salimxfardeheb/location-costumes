/*
  Warnings:

  - You are about to drop the column `label` on the `accessory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."accessory" DROP COLUMN "label",
ADD COLUMN     "Model" TEXT;
