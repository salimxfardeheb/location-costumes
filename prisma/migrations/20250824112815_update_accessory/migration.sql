/*
  Warnings:

  - You are about to drop the column `accessory_id` on the `location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_accessory_id_fkey";

-- AlterTable
ALTER TABLE "public"."location" DROP COLUMN "accessory_id";

-- CreateTable
CREATE TABLE "public"."LocationAccessory" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "accessory_id" INTEGER NOT NULL,

    CONSTRAINT "LocationAccessory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LocationAccessory" ADD CONSTRAINT "LocationAccessory_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LocationAccessory" ADD CONSTRAINT "LocationAccessory_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
