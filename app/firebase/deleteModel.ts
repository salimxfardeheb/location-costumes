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
import { storage } from "@/lib/firebase/connect";
import { ref, deleteObject } from "firebase/storage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { categories } from "@/app/functions";

export async function deleteModel(item: string, model: string) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  if (!categories.includes(item)) {
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
        const decodedPath = decodeURIComponent(
          imagePath.split("/o/")[1].split("?")[0]
        );
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef);
      } catch (err) {}
    }

    await deleteDoc(doc(db, item, result_item.id));
  } catch (e) {
    console.error("error : ", e);
  }
}
