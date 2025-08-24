/*
  Warnings:

  - You are about to drop the column `costume_id` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `shirt_id` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `shoe_id` on the `location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_boutique_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_costume_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_shirt_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_shoe_id_fkey";

-- AlterTable
ALTER TABLE "public"."location" DROP COLUMN "costume_id",
DROP COLUMN "shirt_id",
DROP COLUMN "shoe_id",
ADD COLUMN     "blazerVariantId" INTEGER,
ADD COLUMN     "pantVariantId" INTEGER,
ADD COLUMN     "shirtVariantId" INTEGER,
ADD COLUMN     "shoeVariantId" INTEGER;

-- CreateTable
CREATE TABLE "public"."CostumeVariant" (
    "id" SERIAL NOT NULL,
    "costume_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "CostumeVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShirtVariant" (
    "id" SERIAL NOT NULL,
    "shirt_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "ShirtVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShoeVariant" (
    "id" SERIAL NOT NULL,
    "shoe_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "ShoeVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CostumeVariant" ADD CONSTRAINT "CostumeVariant_costume_id_fkey" FOREIGN KEY ("costume_id") REFERENCES "public"."costume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_blazerVariantId_fkey" FOREIGN KEY ("blazerVariantId") REFERENCES "public"."CostumeVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_pantVariantId_fkey" FOREIGN KEY ("pantVariantId") REFERENCES "public"."CostumeVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_shirtVariantId_fkey" FOREIGN KEY ("shirtVariantId") REFERENCES "public"."ShirtVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_shoeVariantId_fkey" FOREIGN KEY ("shoeVariantId") REFERENCES "public"."ShoeVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShirtVariant" ADD CONSTRAINT "ShirtVariant_shirt_id_fkey" FOREIGN KEY ("shirt_id") REFERENCES "public"."shirt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoeVariant" ADD CONSTRAINT "ShoeVariant_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "public"."shoe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
