"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const allowedModels = ["costume", "shirt", "shoe", "accessory"];

export async function getcategoryCloth(
  item: string
): Promise<{ model: string; image: string | null }[]> {
  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;

  if (!boutiqueIdStr) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueId = parseInt(boutiqueIdStr, 10);

  if (!allowedModels.includes(item) && boutiqueId) {
    throw new Error("Table non valide");
  }

  const data = await (prisma as any)[item].findMany({
    where: { boutique_id: boutiqueId },
  });
  return data;
}

export async function getOneCategoryCloth(
  item: string,
  model: string
): Promise<{
  costume_id : number;
  shirt_id : number ;
  shoe_id : number;
  accessory_id : number;
  description: any;
  size: any;
  pants: any;
  blazer: any; model: string; image: string | null 
} | null> {

  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;
  if (!boutiqueIdStr) {
    throw new Error("Boutique ID manquant");
  }
  const boutiqueId = parseInt(boutiqueIdStr, 10);
  if (!allowedModels.includes(item) && boutiqueId) {
    throw new Error("Table non valide");
  }

  const data = await (prisma as any)[item].findFirst({
    where: { boutique_id: boutiqueId, model },
  });

  return data;
}
