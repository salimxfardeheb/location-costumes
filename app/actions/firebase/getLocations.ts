"use server";

import { db } from "@/lib/firebase/connect";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Costume = {
  ref: string;
  model: string;
  blazer: string;
  pant: string;
  image?: string;
};

type Shirt = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Shoe = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Accessory = {
  ref: string;
  model: string;
  image?: string;
};

type LocationItem = {
  id: string;
  date_sortie: Date;
  costumes: Costume[];
  shirt: Shirt | null;
  shoe: Shoe | null;
  accessories: Accessory[];
};

export async function get_locations(showAll: boolean): Promise<LocationItem[]> {
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
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  const locations = reqSnapshot.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      date_sortie: new Date(data.location_date),
      costumes: Array.isArray(data.costume)
        ? data.costume.map((c: any) => ({
            ref: c.ref,
            model: c.model,
            blazer: c.blazer,
            pant: c.pant,
            image: c.image,
          }))
        : [],

      shirt: data.shirt
        ? {
            ref: data.shirt.ref,
            model: data.shirt.model,
            size: data.shirt.size,
            image: data.shirt.image,
          }
        : null,

      shoe: data.shoe
        ? {
            ref: data.shoe.ref,
            model: data.shoe.model,
            size: data.shoe.size,
            image: data.shoe.image,
          }
        : null,

      accessories: Array.isArray(data.accessory)
        ? data.accessory.map((a: any) => ({
            ref: a.ref,
            model: a.model,
            image: a.image,
          }))
        : [],
    };
  });
}

export async function get_one_location(
  id_location: string
): Promise<LocationItem | null> {
  const locationRef = doc(db, "location", id_location);
  const snapshot = await getDoc(locationRef);
  if (!snapshot.exists()) {
    return null;
  }
  const locationData = snapshot.data();
  return {
    id: id_location,
    date_sortie: new Date(locationData.location_date),
    costumes: Array.isArray(locationData.costume)
      ? locationData.costume.map((c: any) => ({
          ref: c.ref,
          model: c.model,
          blazer: c.blazer,
          pant: c.pant,
          image: c.image,
        }))
      : [],
    shirt: locationData.shirt
      ? {
          ref: locationData.shirt.ref,
          model: locationData.shirt.model,
          size: locationData.shirt.size,
          image: locationData.shirt.image,
        }
      : null,
    shoe: locationData.shoe
      ? {
          ref: locationData.shoe.ref,
          model: locationData.shoe.model,
          size: locationData.shoe.size,
          image: locationData.shoe.image,
        }
      : null,
    accessories: Array.isArray(locationData.accessory)
      ? locationData.accessory.map((a: any) => ({
          ref: a.ref,
          model: a.model,
          image: a.image,
        }))
      : [],
  };
}
