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
import { Location as LocationItem } from "@/app/functions";

export async function get_locations(showAll: boolean): Promise<LocationItem[]> {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueRef = doc(db, "shop", id_boutique);
  const req = query(
    collection(db, "location"),
    where("id_boutique", "==", boutiqueRef),
  );

  const reqSnapshot = await getDocs(req);
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  const locations = reqSnapshot.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      location_date: new Date(data.location_date),
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
            description: a.description,
          }))
        : [],

      client: data.client
        ? {
            name: data.client.name,
            phone: data.client.phone,
            vers: data.client.vers,
            rest: data.client.rest,
            comment: data.client.comment,
          }
        : null,
      total: data.total,
    };
  });

  if (!showAll) {
    return locations.filter((loc) => {
      const date = new Date(loc.location_date);
      return date >= today;
    });
  }

  return locations;
}

export async function get_one_location(
  id_location: string,
): Promise<LocationItem | null> {
  const locationRef = doc(db, "location", id_location);
  const snapshot = await getDoc(locationRef);
  if (!snapshot.exists()) {
    return null;
  }
  const locationData = snapshot.data();
  return {
    id: id_location,
    location_date: locationData.location_date?.toDate
      ? locationData.location_date.toDate()
      : new Date(locationData.location_date),
    costumes: Array.isArray(locationData.costume)
      ? locationData.costume.map((c: any) => ({
          ref: c.ref?.path ?? null,
          model: c.model,
          blazer: c.blazer,
          pant: c.pant,
          image: c.image,
        }))
      : [],
    chemise: locationData.chemise
      ? {
          ref: locationData.chemise.ref.path ?? null,
          model: locationData.chemise.model,
          size: locationData.chemise.size,
          image: locationData.chemise.image,
        }
      : null,
    chaussure: locationData.chaussure
      ? {
          ref: locationData.chaussure.ref.path ?? null,
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
          description: a.description,
        }))
      : [],
    client: locationData.client
      ? {
          name: locationData.client.name,
          phone: locationData.client.phone,
          vers: locationData.client.vers,
          rest: locationData.client.rest,
          comment: locationData.client.comment,
        }
      : null,
    total: locationData.total,
  };
}

export async function get_location_perDate(
  location_date: String,
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
    where("location_date", "==", location_date),
  );
  const reqSnapshot = await getDocs(req);
  const locations = reqSnapshot.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      location_date: new Date(data.location_date),
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
            description: a.description,
          }))
        : [],

      client: data.client
        ? {
            name: data.client.name,
            phone: data.client.phone,
            vers: data.client.vers,
            rest: data.client.rest,
            comment: data.client.comment,
          }
        : null,
      total: data.total,
    };
  });
  return locations;
}
