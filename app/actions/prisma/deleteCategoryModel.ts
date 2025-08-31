"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const allowedModels = ["costume", "shirt", "shoe", "accessory"];

export async function DeleteModel(item: string, model: string) {
  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;

  if (!boutiqueIdStr) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueId = parseInt(boutiqueIdStr, 10);

  if (!allowedModels.includes(item) && boutiqueId) {
    throw new Error("Table non valide");
  }

  await (prisma as any)[item].deleteMany({
    where: {
      boutique_id: boutiqueId,
      model: model,
    },
  });
}
