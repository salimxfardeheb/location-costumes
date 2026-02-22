"use server";

import { db } from "@/lib/firebase/connect";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { size } from "../functions";

interface EditLocationInput {
  locationId: string;
  location_date: Date | string;
  costume: { ref?: string; model: string; blazer?: string; pant?: string }[];
  chemise: { model: string; size: string } | null;
  chaussure: { model: string; size: string } | null;
  accessoire: { model: string; description?: string }[];
  client: {
    name: string;
    phone: string;
    vers: number;
    rest: number;
    comment?: string;
  };
  total: number;
}

export async function edit_location(location: EditLocationInput) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) throw new Error("Boutique ID manquant");

  const boutiqueRef = doc(db, "shop", id_boutique);

  // ── Vérifier que la location existe ─────────────────────────────────────
  const locationRef = doc(db, "location", location.locationId);
  const locationSnap = await getDoc(locationRef);
  if (!locationSnap.exists()) throw new Error("Location introuvable");

  const rentDate =
    location.location_date instanceof Date
      ? location.location_date
      : new Date(location.location_date);

  // ── Costumes ─────────────────────────────────────────────────────────────
  const costumeRefs: any[] = [];
  if (location.costume && location.costume.length > 0) {
    for (const model of location.costume) {
      if (!model.model || model.model.trim() === "") continue;

      const reqCostume = query(
        collection(db, "costume"),
        where("id_boutique", "==", boutiqueRef),
        where("model", "==", model.model),
      );
      const reqCostumeSnapshot = await getDocs(reqCostume);
      if (reqCostumeSnapshot.empty) {
        throw new Error(`Costume "${model.model}" introuvable`);
      }

      const id_costume = reqCostumeSnapshot.docs[0].id;
      const costumeRef = doc(db, "costume", id_costume);
      const costumeData = reqCostumeSnapshot.docs[0].data();

      // Ajouter la date aux tailles concernées
      costumeData.blazerSize?.forEach((s: size) => {
        if (s.size === model.blazer) {
          if (!Array.isArray(s.location_date)) s.location_date = [];
          s.location_date.push(rentDate);
        }
      });

      costumeData.pantSize?.forEach((s: size) => {
        if (s.size === model.pant) {
          if (!Array.isArray(s.location_date)) s.location_date = [];
          s.location_date.push(rentDate);
        }
      });

      await setDoc(costumeRef, costumeData);

      costumeRefs.push({
        ref: costumeRef,
        model: model.model,
        blazer: model.blazer || "",
        pant: model.pant || "",
        image: reqCostumeSnapshot.docs[0].data().image_path ?? null,
      });
    }
  }

  // ── Chemise ──────────────────────────────────────────────────────────────
  let shirtData = null;
  if (location.chemise && location.chemise.model.trim() !== "") {
    const reqShirt = query(
      collection(db, "chemise"),
      where("id_boutique", "==", boutiqueRef),
      where("model", "==", location.chemise.model),
    );
    const reqShirtSnapshot = await getDocs(reqShirt);
    if (reqShirtSnapshot.empty) {
      throw new Error(`Chemise "${location.chemise.model}" introuvable`);
    }

    const id_shirt = reqShirtSnapshot.docs[0].id;
    const shirtRef = doc(db, "chemise", id_shirt);
    const setShirtData = reqShirtSnapshot.docs[0].data();

    if (!location.chemise.size) {
      throw new Error("Taille de chemise manquante");
    }

    const shirtFound = setShirtData.size?.some(
      (s: size) => s.size === location.chemise?.size,
    );
    if (!shirtFound) {
      throw new Error(`Taille "${location.chemise.size}" introuvable pour cette chemise`);
    }

    setShirtData.size?.forEach((s: size) => {
      if (s.size === location.chemise?.size) {
        if (!Array.isArray(s.location_date)) s.location_date = [];
        s.location_date.push(rentDate);
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

  // ── Chaussure ────────────────────────────────────────────────────────────
  let shoeData = null;
  if (location.chaussure && location.chaussure.model.trim() !== "") {
    const reqShoe = query(
      collection(db, "chaussure"),
      where("id_boutique", "==", boutiqueRef),
      where("model", "==", location.chaussure.model),
    );
    const reqShoeSnapshot = await getDocs(reqShoe);
    if (reqShoeSnapshot.empty) {
      throw new Error(`Chaussure "${location.chaussure.model}" introuvable`);
    }

    const id_shoe = reqShoeSnapshot.docs[0].id;
    const shoeRef = doc(db, "chaussure", id_shoe);
    const setShoeData = reqShoeSnapshot.docs[0].data();

    if (!location.chaussure.size) {
      throw new Error("Pointure manquante");
    }

    const shoeFound = setShoeData.size?.some(
      (s: size) => s.size === location.chaussure?.size,
    );
    if (!shoeFound) {
      throw new Error(`Pointure "${location.chaussure.size}" introuvable pour cette chaussure`);
    }

    setShoeData.size?.forEach((s: size) => {
      if (s.size === location.chaussure?.size) {
        if (!Array.isArray(s.location_date)) s.location_date = [];
        s.location_date.push(rentDate);
      }
    });

    await setDoc(shoeRef, setShoeData);

    shoeData = {
      ref: shoeRef,
      model: location.chaussure.model,
      size: location.chaussure.size,
      image: reqShoeSnapshot.docs[0].data().image_path ?? null,
    };
  }

  // ── Accessoires ──────────────────────────────────────────────────────────
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
        throw new Error(`Accessoire "${acc.model}" introuvable`);
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

  // ── Calcul du reste ──────────────────────────────────────────────────────
  const vers = Number(location.client.vers) || 0;
  const total = Number(location.total) || 0;
  const rest = vers < total ? total - vers : 0;

  // ── Mise à jour de la location ───────────────────────────────────────────
  const updatePayload = {
    id_boutique: boutiqueRef,
    location_date: Timestamp.fromDate(rentDate),
    costume: costumeRefs,
    chemise: shirtData,
    chaussure: shoeData,
    accessoire: accessoryRefs,
    client: {
      name: location.client.name,
      phone: location.client.phone,
      vers,
      rest,
      comment: location.client.comment || "",
    },
    total,
    updated_at: Timestamp.now(),
  };

  await updateDoc(locationRef, updatePayload);

  return { id: location.locationId, ...updatePayload };
}