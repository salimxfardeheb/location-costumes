"use server";

import { db } from "@/lib/firebase/connect";
import { collection, addDoc, doc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface ItemCloth {
model : string
blazer? : string,
pant? : string
size? : string,
}


export interface location {
    location_date : Date,
    costume : ItemCloth[],
    shirt : ItemCloth,
    shoe : ItemCloth,
    accessory : string[],
}

export async function create_location(location : location) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  
  try {
    const boutiqueRef = doc(db, "shop", id_boutique);
    if(location.costume.length > 0) {
    if(location.shirt){}
    if(location.shoe){}
    if(location.accessory){}

  }

  } catch (e) {
    console.error("error ", e)
  }
}
