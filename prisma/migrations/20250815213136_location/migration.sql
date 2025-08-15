-- CreateTable
CREATE TABLE "public"."accessory" (
    "id" SERIAL NOT NULL,
    "boutique_id" INTEGER NOT NULL,
    "label" TEXT,
    "image" TEXT,

    CONSTRAINT "accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boutique" (
    "id" SERIAL NOT NULL,
    "nom_boutique" VARCHAR(255) NOT NULL,
    "admin" VARCHAR(255) NOT NULL,
    "password" VARCHAR(500) NOT NULL,

    CONSTRAINT "boutique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."costume" (
    "id" SERIAL NOT NULL,
    "boutique_id" INTEGER NOT NULL,
    "model" INTEGER,
    "blazer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pants" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image" TEXT,

    CONSTRAINT "costume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" SERIAL NOT NULL,
    "boutique_id" INTEGER NOT NULL,
    "costume_id" INTEGER,
    "shirt_id" INTEGER,
    "shoe_id" INTEGER,
    "accessory_id" INTEGER,
    "location_date" DATE,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shirt" (
    "id" SERIAL NOT NULL,
    "boutique_id" INTEGER NOT NULL,
    "model" TEXT,
    "color" TEXT,
    "size" TEXT,
    "image" TEXT,

    CONSTRAINT "shirt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shoe" (
    "id" SERIAL NOT NULL,
    "boutique_id" INTEGER NOT NULL,
    "model" TEXT,
    "color" TEXT,
    "size" TEXT,
    "image" TEXT,

    CONSTRAINT "shoe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boutique_nom_boutique_key" ON "public"."boutique"("nom_boutique");

-- AddForeignKey
ALTER TABLE "public"."accessory" ADD CONSTRAINT "accessory_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."costume" ADD CONSTRAINT "costume_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_costume_id_fkey" FOREIGN KEY ("costume_id") REFERENCES "public"."costume"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_shirt_id_fkey" FOREIGN KEY ("shirt_id") REFERENCES "public"."shirt"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "public"."shoe"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."shirt" ADD CONSTRAINT "shirt_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."shoe" ADD CONSTRAINT "shoe_boutique_id_fkey" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
