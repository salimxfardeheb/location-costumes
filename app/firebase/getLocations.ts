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

type Chemise = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Chausssure = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Accessoire = {
  ref: string;
  model: string;
  image?: string;
};

type LocationItem = {
  id: string;
  date_sortie: Date;
  costumes: Costume[];
  chemise: Chemise | null;
  chaussure: Chausssure | null;
  accessories: Accessoire[];
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

      chemise: data.chemise
        ? {
            ref: data.chemise.ref,
            model: data.chemise.model,
            size: data.chemise.size,
            image: data.chemise.image,
          }
        : null,

      chaussure: data.chaussure
        ? {
            ref: data.chaussure.ref,
            model: data.chaussure.model,
            size: data.chaussure.size,
            image: data.chaussure.image,
          }
        : null,

      accessories: Array.isArray(data.accessoire)
        ? data.accessoire.map((a: any) => ({
            ref: a.ref,
            model: a.model,
            image: a.image,
          }))
        : [],
    };
  });

  if (!showAll) {
    return locations.filter((loc) => {
      const date = new Date(loc.date_sortie);
      return date >= today;
    });
  }

  return locations;
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
    chemise: locationData.chemise
      ? {
          ref: locationData.chemise.ref,
          model: locationData.chemise.model,
          size: locationData.chemise.size,
          image: locationData.chemise.image,
        }
      : null,
    chaussure: locationData.chaussure
      ? {
          ref: locationData.chaussure.ref,
          model: locationData.chaussure.model,
          size: locationData.chaussure.size,
          image: locationData.chaussure.image,
        }
      : null,
    accessories: Array.isArray(locationData.accessoire)
      ? locationData.accessoire.map((a: any) => ({
          ref: a.ref,
          model: a.model,
          image: a.image,
        }))
      : [],
  };
}

export async function get_location_perDate(
  location_date: String
): Promise<LocationItem[]> {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueRef = doc(db, "shop", id_boutique);
  const req = query(
    collection(db, "location"),
    where("id_boutique", "==", boutiqueRef),
    where("location_date", "==", location_date)
  );
  const reqSnapshot = await getDocs(req);
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

      chemise: data.chemise
        ? {
            ref: data.chemise.ref,
            model: data.chemise.model,
            size: data.chemise.size,
            image: data.chemise.image,
          }
        : null,

      chaussure: data.chaussure
        ? {
            ref: data.chaussure.ref,
            model: data.chaussure.model,
            size: data.chaussure.size,
            image: data.chaussure.image,
          }
        : null,

      accessories: Array.isArray(data.accessoire)
        ? data.accessoire.map((a: any) => ({
            ref: a.ref,
            model: a.model,
            image: a.image,
          }))
        : [],
    };
  });
  return locations;
}
