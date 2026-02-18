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
import { checkAvailability } from "./checkAvailability";
import { LocationInput, size } from "../functions";

export async function create_location(location: LocationInput) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) {
    throw new Error("Boutique ID manquant");
  }
  try {
    const boutiqueRef = doc(db, "shop", id_boutique);

    let missingCostume = false;
    let missingChemise = false;
    let missingChaussure = false;
    let missingAcc = false;

    let missingCostumeBlazer = false;
    let missingCostumePant = false;
    let missingChemiseSize = false;
    let missingChaussureSize = false;

    let blazerLocate = false;
    let pantLocate = false;

    // --- Costumes ---
    const costumeRefs: any[] = [];
    if (location.costume && location.costume.length > 0) {
      for (const model of location.costume) {
        const result = await checkAvailability(
          model.model,
          model.blazer!,
          model.pant!,
          location.location_date,
        );

        if (!result.ok) {
          throw new Error(result.message);
        }
        if (!model.model || model.model.trim() === "") {
          continue;
        }

        const reqCostume = query(
          collection(db, "costume"),
          where("id_boutique", "==", boutiqueRef),
          where("model", "==", model.model),
        );
        const reqCostumeSnapshot = await getDocs(reqCostume);
        if (reqCostumeSnapshot.empty) {
          missingCostume = true;
          break;
        }

        const id_costume = reqCostumeSnapshot.docs[0].id;
        const costumeRef = doc(db, "costume", id_costume);
        const costumeData = reqCostumeSnapshot.docs[0].data();

        costumeData.blazerSize.forEach((s: size) => {
          if (s.size === model.blazer) {
            if (!Array.isArray(s.location_date)) {
              s.location_date = [];
            }
            s.location_date.push(location.location_date);
          }
        });

        costumeData.pantSize.forEach((s: size) => {
          if (s.size === model.pant) {
            if (!Array.isArray(s.location_date)) {
              s.location_date = [];
            }
            s.location_date.push(location.location_date);
          }
        });
        await setDoc(costumeRef, costumeData);

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
    if (location.chemise && location.chemise.model.trim() !== "") {
      const reqShirt = query(
        collection(db, "chemise"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.chemise.model),
      );
      const reqShirtSnapshot = await getDocs(reqShirt);
      if (reqShirtSnapshot.empty) {
        missingChemise = true;
      } else {
        const id_shirt = reqShirtSnapshot.docs[0].id;
        const shirtRef = doc(db, "chemise", id_shirt);
        const setShirtData = reqShirtSnapshot.docs[0].data();

        if (!location.chemise.size) {
          missingChemiseSize = true;
        } else {
          const shirtFound = setShirtData.size.some(
            (s: size) => s.size === location.chemise?.size,
          );
          if (!shirtFound) {
            missingChemiseSize = true;
          } else {
            setShirtData.size.forEach((s: size) => {
              if (!Array.isArray(s.location_date)) {
                s.location_date = [];
              }
              if (s.size === location.chemise?.size) {
                s.location_date.push(location.location_date);
              }
            });
          }
        }

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
    if (location.chaussure && location.chaussure.model.trim() !== "") {
      const reqShoe = query(
        collection(db, "chaussure"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", location.chaussure.model),
      );
      const reqShoeSnapshot = await getDocs(reqShoe);
      if (reqShoeSnapshot.empty) {
        missingChaussure = true;
      } else {
        const id_shoe = reqShoeSnapshot.docs[0].id;
        const refShoe = doc(db, "chaussure", id_shoe);
        const setShoeData = reqShoeSnapshot.docs[0].data();

        if (!location.chaussure.size) {
          missingChaussureSize = true;
        } else {
          const shoeFound = setShoeData.size.some(
            (s: size) => s.size === location.chaussure?.size,
          );
          if (!shoeFound) {
            missingChaussureSize = true;
          } else {
            setShoeData.size.forEach((s: size) => {
              if (s.size === location.chaussure?.size) {
                if (!Array.isArray(s.location_date)) {
                  s.location_date = [];
                }
                s.location_date.push(location.location_date);
              }
            });
          }
        }

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
        if (!acc.model || acc.model.trim() === "") continue;

        const reqAcc = query(
          collection(db, "accessoire"),
          where("id_boutique", "==", boutiqueRef),
          where("model", "==", acc.model),
        );
        const reqAccSnapshot = await getDocs(reqAcc);
        if (reqAccSnapshot.empty) {
          missingAcc = true;
          break;
        }
        const id_acc = reqAccSnapshot.docs[0].id;
        const accessoryRef = doc(db, "accessoire", id_acc);

        accessoryRefs.push({
          ref: accessoryRef,
          model: acc.model,
          image: reqAccSnapshot.docs[0].data().image_path ?? null,
        });
      }
    }

    if (missingCostume || missingCostumeBlazer || missingCostumePant) {
      throw new Error("Costume existe pas ou taille manquante");
    }
    if (missingChemise || missingChemiseSize) {
      throw new Error("Chemise existe pas ou taille manquante");
    }
    if (missingChaussure || missingChaussureSize) {
      throw new Error("Chaussure existe pas ou pointure manquante");
    }
    if (missingAcc) {
      throw new Error("Accessoire existe pas");
    }
    if (blazerLocate) {
      throw new Error("Blazer n'est pas disponible à cette date");
    }
    if (pantLocate) {
      throw new Error("Le pantalon n'est pas disponible à cette date");
    }

    // --- Création de la location ---
    const locationData = {
      id_boutique: boutiqueRef,
      location_date: location.location_date,
      costume: costumeRefs,
      chemise: shirtData,
      chaussure: shoeData,
      accessoire: accessoryRefs,
      client: location.client,
      total: location.total,
    };

    const docRef = await addDoc(collection(db, "location"), locationData);

    return { id: docRef.id, ...locationData };
  } catch (e) {
    console.error("Erreur lors de la création de location: ", e);
    throw e;
  }
}
