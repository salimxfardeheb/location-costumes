"use server";
import { db } from "@/lib/firebase/connect";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { get_one_location } from "./getLocations";

export async function deleteLocation(idLocation: string) {
  const session = await getServerSession(authOptions);
  const id_boutique = session?.user?.boutiqueId;

  if (!id_boutique) throw new Error("Boutique ID manquant");
  if (!idLocation) throw new Error("Location introuvable");

  // Récupérer les données via get_one_location
  const locationData = await get_one_location(idLocation);
  if (!locationData) throw new Error("Location introuvable en base");

  const locationDateMs = new Date(locationData.location_date).getTime();

  const removeDateFromSizes = (sizes: any[]) =>
    sizes.map((s) => ({
      ...s,
      location_date: (s.location_date ?? []).filter(
        (d: any) => new Date(d).getTime() !== locationDateMs,
      ),
    }));

  try {
    // 1. Costumes — blazer et pant
    if (locationData.costumes && locationData.costumes.length > 0) {
      for (const costume of locationData.costumes) {
        if (!costume.ref) continue;

        const costumeRef =
          typeof costume.ref === "string" ? doc(db, costume.ref) : costume.ref;

        const costumeSnap = await getDoc(costumeRef);
        if (!costumeSnap.exists()) continue;

        const data = costumeSnap.data();

        await updateDoc(costumeRef, {
          blazerSize: removeDateFromSizes(data.blazerSize ?? []),
          pantSize: removeDateFromSizes(data.pantSize ?? []),
        });
      }
    }

    // 2. Chemise
    if (locationData.chemise?.ref) {
      const chemiseSnap = await getDoc(doc(db, locationData.chemise.ref));
      if (chemiseSnap.exists()) {
        const data = chemiseSnap.data();
        await updateDoc(doc(db, locationData.chemise.ref), {
          size: removeDateFromSizes(data.size ?? []),
        });
      }
    }

    // 3. Chaussure
    if (locationData.chaussure?.ref) {
      const chaussureSnap = await getDoc(doc(db, locationData.chaussure.ref));
      if (chaussureSnap.exists()) {
        const data = chaussureSnap.data();
        await updateDoc(doc(db, locationData.chaussure.ref), {
          size: removeDateFromSizes(data.size ?? []),
        });
      }
    }

    // 4. Supprimer le document location
    await deleteDoc(doc(db, "location", idLocation));
  } catch (e) {
    console.error("Erreur lors de la suppression:", e);
    throw e;
  }
}
