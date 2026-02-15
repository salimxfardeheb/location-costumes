"use server";

import { db } from "@/lib/firebase/connect";
import {
  doc,
  deleteDoc,
} from "firebase/firestore";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteLocation(idLocation: string) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;
    if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  if(!idLocation){
    throw new Error("Location introuvable");
  }
  try{
    await deleteDoc(doc(db, "location", idLocation))
  }catch (e) {
    console.error("error : ", e);
  }
}
