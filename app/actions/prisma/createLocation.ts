'use server'
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function createLocation(
  location_date: Date,
  costume: string,
  sizeBlazer: string | null,
  sizePant: string | null,
  shirt: string | null,
  sizeShirt: string | null,
  shoe: string | null,
  sizeShoe: string | null,
  accessories: string[]
) {
  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;
  if (!boutiqueIdStr) throw new Error("Boutique ID manquant");

  const boutiqueId = parseInt(boutiqueIdStr, 10);

  const blazerVariant = sizeBlazer
    ? await prisma.costumeVariant.findFirst({
        where: {
          size: sizeBlazer,
          type: "blazer",
          costume: { model: costume, boutique_id: boutiqueId },
        },
      })
    : null;

  const pantVariant = sizePant
    ? await prisma.costumeVariant.findFirst({
        where: {
          size: sizePant,
          type: "pants",
          costume: { model: costume, boutique_id: boutiqueId },
        },
      })
    : null;

  const shirtVariant = sizeShirt
    ? await prisma.shirtVariant.findFirst({
        where: {
          size: sizeShirt,
          shirt: { model: shirt, boutique_id: boutiqueId },
        },
      })
    : null;

  const shoeVariant = sizeShoe
    ? await prisma.shoeVariant.findFirst({
        where: {
          size: sizeShoe,
          shoe: { model: shoe, boutique_id: boutiqueId },
        },
      })
    : null;

  const foundAccessories = await prisma.accessory.findMany({
    where: { model: { in: accessories }, boutique_id: boutiqueId },
    select: { id: true },
  });

  const data = await prisma.location.create({
    data: {
      boutique_id: boutiqueId,
      blazerVariantId: blazerVariant?.id ?? null,
      pantVariantId: pantVariant?.id ?? null,
      shirtVariantId: shirtVariant?.id ?? null,
      shoeVariantId: shoeVariant?.id ?? null,
      location_date,
      accessories: {
        create: foundAccessories.map((acc) => ({
          accessory: { connect: { id: acc.id } },
        })),
      },
    },
    include: {
      blazer: true,
      pant: true,
      shirt: true,
      shoe: true,
      accessories: { include: { accessory: true } },
    },
  });

  return data;
}
