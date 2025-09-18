"use server";

import { db } from "@/lib/firebase/connect";
import {
  doc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs/promises";
import path from "path";

const allowedModels = ["costume", "shirt", "shoe", "accessory"];

export async function deleteModel(item: string, model: string) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  if (!allowedModels.includes(item)) {
    throw new Error("Table non valide");
  }

  try {
    const boutiqueRef = doc(db, "shop", id_boutique);
    const req = query(
      collection(db, item),
      where("id_boutique", "==", boutiqueRef),
      where("model", "==", model)
    );
    const reqSnapshot = await getDocs(req);
    const result_item = reqSnapshot.docs[0];

    const content_item = result_item.data();

    const imagePath = content_item?.image_path;

    if (imagePath) {
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          path.basename(imagePath)
        );
        await fs.unlink(filePath);
        console.log("Image supprimée :", filePath);
      } catch (err) {
        console.error("Erreur suppression image :", err);
      }
    }

    await deleteDoc(doc(db, item, result_item.id));
    console.log("Modèle supprimé :", result_item.id);
  } catch (e) {
    console.error("error : ", e);
  }
}
