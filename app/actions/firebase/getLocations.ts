"use server";

import { db } from "@/lib/firebase/connect";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Costume = {
  ref: string;
  model: string;
  blazer: string;
  pant: string;
};

type Shirt = {
  ref: string;
  model: string;
  size: string;
};

type Shoe = {
  ref: string;
  model: string;
  size: string;
};

type Accessory = {
  ref: string;
  model: string;
};

type LocationItem = {
  date_sortie: Date;
  costumes: Costume[];
  shirt: Shirt | null;
  shoe: Shoe | null;
  accessories: Accessory[];
};

export async function get_locations(): Promise<LocationItem[]> {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueRef = doc(db, "shop", id_boutique);
  const req = query(
    collection(db, "location"),
    where("id_boutique", "==", boutiqueRef)
  );

  const reqSnapshot = await getDocs(req);

  return reqSnapshot.docs.map((snap) => {
    const data = snap.data();

    return {
      date_sortie: new Date(data.location_date),
      costumes: Array.isArray(data.costume)
        ? data.costume.map((c: any) => ({
            ref: c.ref,
            model: c.model,
            blazer: c.blazer,
            pant: c.pant,
          }))
        : [],

      shirt: data.shirt
        ? {
            ref: data.shirt.ref,
            model: data.shirt.model,
            size: data.shirt.size,
          }
        : null,

      shoe: data.shoe
        ? {
            ref: data.shoe.ref,
            model: data.shoe.model,
            size: data.shoe.size,
          }
        : null,

      accessories: Array.isArray(data.accessory)
        ? data.accessory.map((a: any) => ({
            ref: a.ref,
            model: a.model,
          }))
        : [],
    };
  });
}
