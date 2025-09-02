"use server";

import { db } from "@/lib/firebase/connect";
import { collection, addDoc, doc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface collectio_item {
  type_collection: string; // all
  model: string; // all
  image_path: string; // all
  blazerSize?: string[]; // costume
  pantSize?: string[]; // costume
  size?: string[]; // shirt & shoe
  color?: string; // shirt & shoe
  description?: string; // accessoire
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
    const boutiqueRef = doc(db, "shop", id_boutique);
    const docRef = await addDoc(collection(db, item.type_collection), {
      ...data,
      id_boutique: boutiqueRef,
    });
    console.log("Model crée avec succée ! ID : ", docRef.id);
  } catch (e) {
    console.error("error : ", e);
  }
}
