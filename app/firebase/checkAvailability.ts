import { get_one_category_cloth } from "./getCategoryCloth";

export type AvailabilityResult = {
  ok: boolean;
  message?: string;
};

export async function checkAvailability(
  model: string,
  blazer: string,
  pant: string,
  location_date: string
): Promise<AvailabilityResult> {
  try {
    if (!model) {
      return { ok: false, message: "❌ Costume inexistant" };
    }

    const costumeData = await get_one_category_cloth("costume", model);

    // Vérif blazer
    if (!blazer) {
      return { ok: false, message: "❌ Taille de blazer manquante" };
    }
    const blazerFound = costumeData.blazerSize?.some((s: any) => s.size === blazer);
    if (!blazerFound) {
      return { ok: false, message: `❌ Blazer taille ${blazer} non disponible dans ce modèle` };
    }
    const blazerUnavailable = costumeData.blazerSize?.some(
      (s: any) => s.size === blazer && s.location_date?.includes(location_date)
    );
    if (blazerUnavailable) {
      return { ok: false, message: `❌ Blazer taille ${blazer} déjà loué à la date ${location_date}` };
    }

    // Vérif pantalon
    if (!pant) {
      return { ok: false, message: "❌ Taille de pantalon manquante" };
    }
    const pantFound = costumeData.pantSize?.some((s: any) => s.size === pant);
    if (!pantFound) {
      return { ok: false, message: `❌ Pantalon taille ${pant} non disponible dans ce modèle` };
    }
    const pantUnavailable = costumeData.pantSize?.some(
      (s: any) => s.size === pant && s.location_date?.includes(location_date)
    );
    if (pantUnavailable) {
      return { ok: false, message: `❌ Pantalon taille ${pant} déjà loué à la date ${location_date}` };
    }

    // ✅ Tout est bon
    return { ok: true };
  } catch (err: any) {
    console.error("Erreur checkAvailability:", err);
    return { ok: false, message: "❌ Erreur interne lors de la vérification." };
  }
}
