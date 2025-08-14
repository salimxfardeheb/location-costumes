'use server'

import prisma from "@/lib/prisma";

export async function getcategoryCloth(item: string , id_boutique : number ) {
  const allowedModels = ["costume", "shirt", "shoe", "accessory"];

  if (!allowedModels.includes(item) && id_boutique) {
    throw new Error("Table non valide");
  }

  const data = await (prisma as any)[item].findMany({
    where : { boutique_id: id_boutique }
  });
  return data;
}