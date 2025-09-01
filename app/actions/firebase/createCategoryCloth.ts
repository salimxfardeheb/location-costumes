"use server"

import { db } from "@/lib/firebase/connect";
import { collection, addDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface collectio_item {
  id_boutique?: string;
  type_collection: string;
  model: string;
  blazerSize?: string[];
  pantSize?: string[];
  size?: string[];
  color?: string;
  description?: string;
  image_path: string;
}

const allowedModels = ["costume", "shirt", "shoe", "accessory"];

export async function create_item_cloth(item: collectio_item) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  if (!allowedModels.includes(item.type_collection)) {
    throw new Error("Table non valide");
  }

  try {
    const { type_collection, ...data } = item;
    const docRef = await addDoc(collection(db, item.type_collection), {
      ...data,
      id_boutique,
    });
    console.log("Model crée avec succée ! ID : ", docRef.id);
  } catch (e) {
    console.error("error : ", e);
  }
}
