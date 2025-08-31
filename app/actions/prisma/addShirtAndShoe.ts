"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function addShirtAndShoe(
  item: string,
  model: string,
  color: string,
  size: string[],
  image: string
) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;
  if (!id_boutique) throw new Error("No boutique ID");

  const data = await (prisma as any)[item].create({
    data: {
      boutique_id: parseInt(id_boutique),
      model,
      color,
      size,
      image,
    },
  });
  return data;
}
