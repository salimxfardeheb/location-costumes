"use server";

import { db } from "@/lib/firebase/connect";
import {
  collection,
  addDoc,
  doc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface ItemCloth {
  model: string;
  blazer?: string;
  pant?: string;
  size?: string;
}

export interface LocationInput {
  location_date: string;
  costume: ItemCloth[];
  shirt?: ItemCloth;
  shoe?: ItemCloth;
  accessory?: ItemCloth[];
}

export async function create_location(location: LocationInput) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }

  try {
    const boutiqueRef = doc(db, "shop", id_boutique);

    // --- Costumes ---
    const costumeRefs: any[] = [];
    for (const model of location.costume) {
      const reqCostume = query(
        collection(db, "costume"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", model.model)
      );
      const reqCostumeSnapshot = await getDocs(reqCostume);
      if (!reqCostumeSnapshot.empty) {
        const id_costume = reqCostumeSnapshot.docs[0].id;
        const costumeRef = doc(db, "costume", id_costume);
        costumeRefs.push({
          ref: costumeRef,
          model: model.model,
          blazer: model.blazer,
          pant: model.pant,
        });
      }
    }

    // --- Shirt ---
    let shirtData = null;
    if (location.shirt) {
      const reqShirt = query(
        collection(db, "shirt"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.shirt.model)
      );
      const reqShirtSnapshot = await getDocs(reqShirt);
      if (!reqShirtSnapshot.empty) {
        const id_shirt = reqShirtSnapshot.docs[0].id;
        shirtData = {
          ref: doc(db, "shirt", id_shirt),
          size: location.shirt.size,
        };
      }
    }

    // --- Shoe ---
    let shoeData = null;
    if (location.shoe) {
      const reqShoe = query(
        collection(db, "shoe"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.shoe.model)
      );
      const reqShoeSnapshot = await getDocs(reqShoe);
      if (!reqShoeSnapshot.empty) {
        const id_shoe = reqShoeSnapshot.docs[0].id;
        shoeData = {
          ref: doc(db, "shoe", id_shoe),
          model: location.shirt?.model,
          size: location.shoe.size,
        };
      }
    }

    // --- Accessory ---
    const accessoryRefs: any[] = [];
    if (location.accessory && location.accessory.length > 0) {
      for (const acc of location.accessory) {
        const reqAcc = query(
          collection(db, "accessory"),
          where("id_boutique", "==", boutiqueRef),
          where("model", "==", acc.model)
        );
        const reqAccSnapshot = await getDocs(reqAcc);
        if (!reqAccSnapshot.empty) {
          const id_acc = reqAccSnapshot.docs[0].id;
          accessoryRefs.push({
            ref: doc(db, "accessory", id_acc),
            model: acc.model,
          });
        }
      }
    }

    // --- Création de la location ---
    const locationData = {
      id_boutique: boutiqueRef,
      location_date: location.location_date,
      costume: costumeRefs,
      shirt: shirtData,
      shoe: shoeData,
      accessory: accessoryRefs,
    };

    const docRef = await addDoc(collection(db, "location"), locationData);
    console.log("Location ajoutée avec ID: ", docRef.id);

    return { id: docRef.id, ...locationData };
  } catch (e) {
    console.error("Erreur lors de la création de location: ", e);
    throw e;
  }
}
