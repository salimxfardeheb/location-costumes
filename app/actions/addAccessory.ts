"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function addAccessory(
  model: string,
  description: string,
  image: string
) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;
  if (!id_boutique) throw new Error("No boutique ID");

  const data = await prisma.accessory.create({
    data: {
      boutique_id: parseInt(id_boutique),
      model,
      description,
      image,
    },
  });
  return data;
}
