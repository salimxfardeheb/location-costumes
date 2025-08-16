/*
  Warnings:

  - The `size` column on the `shirt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `size` column on the `shoe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."shirt" DROP COLUMN "size",
ADD COLUMN     "size" TEXT[];

-- AlterTable
ALTER TABLE "public"."shoe" DROP COLUMN "size",
ADD COLUMN     "size" TEXT[];
