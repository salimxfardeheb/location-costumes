"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function addShirtAndShoe(
  item: "shirt" | "shoe",
  model: string,
  color: string,
  size: string[],
  image?: string
) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;
  if (!id_boutique) throw new Error("No boutique ID");

  // mapping des variants dynamiquement selon le type
  const variantKey =
    item === "shirt" ? "ShirtVariant" : item === "shoe" ? "ShoeVariant" : null;

  if (!variantKey) throw new Error("Invalid item type");

  const created = await (prisma as any)[item].create({
    data: {
      boutique_id: parseInt(id_boutique),
      model,
      color,
      size, // tableau simple, utile pour l’affichage rapide
      image,
      variants: {
        create: size.map((s) => ({
          size: s,
        })),
      },
    },
    include: { variants: true },
  });

  return created;
}
