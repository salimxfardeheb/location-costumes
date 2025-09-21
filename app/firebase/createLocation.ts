"use server";

import { db } from "@/lib/firebase/connect";
import {
  collection,
  addDoc,
  doc,
  where,
  query,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { size } from "./createCategoryCloth";

export interface ItemCloth {
  model: string;
  blazer?: string;
  pant?: string;
  size?: string;
  image?: string;
}

export interface LocationInput {
  location_date: string;
  costume: ItemCloth[];
  chemise?: ItemCloth;
  chaussure?: ItemCloth;
  accessoire?: ItemCloth[];
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
        const constumeData = reqCostumeSnapshot.docs[0].data();
        constumeData.blazerSize.map((size: size) => {
          if (model.blazer === size.size) {
            size.location_date.push(location.location_date);
          }
        });

        await setDoc(costumeRef, constumeData);

        costumeRefs.push({
          ref: costumeRef,
          model: model.model,
          blazer: model.blazer,
          pant: model.pant,
          image: reqCostumeSnapshot.docs[0].data().image_path ?? null,
        });
      }
    }

    // --- chemise ---
    let shirtData = null;
    if (location.chemise) {
      const reqShirt = query(
        collection(db, "chemise"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.chemise.model)
      );
      const reqShirtSnapshot = await getDocs(reqShirt);
      if (!reqShirtSnapshot.empty) {
        const id_shirt = reqShirtSnapshot.docs[0].id;
        const shirtRef = doc(db, "chemise", id_shirt);
        const setShirtData = reqShirtSnapshot.docs[0].data();
        setShirtData.size.map((size: size) => {
          if (location.chemise?.size === size.size) {
            size.location_date.push(location.location_date);
          }
        });
        await setDoc(shirtRef, setShirtData);
        shirtData = {
          ref: shirtRef,
          model: location.chemise.model,
          size: location.chemise.size,
          image: reqShirtSnapshot.docs[0].data().image_path ?? null,
        };
      }
    }

    // --- chaussure ---
    let shoeData = null;
    if (location.chaussure) {
      const reqShoe = query(
        collection(db, "chaussure"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.chaussure.model)
      );
      const reqShoeSnapshot = await getDocs(reqShoe);
      if (!reqShoeSnapshot.empty) {
        const id_shoe = reqShoeSnapshot.docs[0].id;
        const refShoe = doc(db, "chaussure", id_shoe);
        const setShoeData = reqShoeSnapshot.docs[0].data();
        setShoeData.size.map((size: size) => {
          if (location.chaussure?.size === size.size) {
            size.location_date.push(location.location_date);
          }
        });
        await setDoc(refShoe, setShoeData);
        shoeData = {
          ref: refShoe,
          model: location.chaussure?.model,
          size: location.chaussure.size,
          image: reqShoeSnapshot.docs[0].data().image_path ?? null,
        };
      }
    }

    // --- accessoire ---
    const accessoryRefs: any[] = [];
    if (location.accessoire && location.accessoire.length > 0) {
      for (const acc of location.accessoire) {
        const reqAcc = query(
          collection(db, "accessoire"),
          where("id_boutique", "==", boutiqueRef),
          where("model", "==", acc.model)
        );
        const reqAccSnapshot = await getDocs(reqAcc);
        if (!reqAccSnapshot.empty) {
          const id_acc = reqAccSnapshot.docs[0].id;
          accessoryRefs.push({
            ref: doc(db, "accessoire", id_acc),
            model: acc.model,
            image: reqAccSnapshot.docs[0].data().image_path ?? null,
          });
        }
      }
    }

    // --- Création de la location ---
    const locationData = {
      id_boutique: boutiqueRef,
      location_date: location.location_date,
      costume: costumeRefs,
      chemise: shirtData,
      chaussure: shoeData,
      accessoire: accessoryRefs,
    };

    const docRef = await addDoc(collection(db, "location"), locationData);
    console.log("Location ajoutée avec ID: ", docRef.id);

    return { id: docRef.id, ...locationData };
  } catch (e) {
    console.error("Erreur lors de la création de location: ", e);
    throw e;
  }
}
