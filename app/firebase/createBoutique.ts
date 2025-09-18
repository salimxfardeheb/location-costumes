"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/firebase/connect";
import { collection, addDoc } from "firebase/firestore";

export async function create_boutique(
  nom_boutique: string,
  admin: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const docRef = await addDoc(collection(db, "shop"), {
      nom_boutique : nom_boutique,
      admin : admin,
      password : hashedPassword ,
    });
    console.log("boutique crée avec succée ! ID : ", docRef.id);
  } catch (e) {
    console.error("error : ", e);
  }
}
