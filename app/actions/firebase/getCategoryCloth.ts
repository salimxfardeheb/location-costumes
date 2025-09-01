"use server";

import { db } from "@/firebase/connect";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const allowedModels = ["costume", "shirt", "shoe", "accessory"];

export async function get_category_cloth(
  item: string
): Promise<{ model: string; image: string | null }[]> {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }

  if (!allowedModels.includes(item)) {
    throw new Error("Table non valide");
  }

  // Construire la référence vers la boutique
  const boutiqueRef = doc(db, "shop", id_boutique);

  // Requête avec comparaison par référence
  const req = query(
    collection(db, item),
    where("id_boutique", "==", boutiqueRef)
  );
  const reqSnapshot = await getDocs(req);

  return reqSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      model: data.model ?? "",
      image: data.image ?? null,
    };
  });
}
