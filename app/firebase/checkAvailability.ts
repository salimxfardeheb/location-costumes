import { get_one_category_cloth } from "./getCategoryCloth";

export type AvailabilityResult = {
  ok: boolean;
  message?: string;
};

function getBlockedInterval(locationDate: Date) {
  const start = new Date(locationDate);
  start.setDate(start.getDate() - 1);

  const end = new Date(locationDate);
  end.setDate(end.getDate() + 2);

  return { start, end };
}

function isDateInInterval(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export async function checkAvailability(
  model: string,
  blazer: string,
  pant: string,
  location_date: Date,
): Promise<AvailabilityResult> {
  try {
    if (!model) {
      return { ok: false, message: "❌ Costume inexistant" };
    }

    const costumeData = await get_one_category_cloth("costume", model);
    const { start, end } = getBlockedInterval(location_date);

    // 🔹 Vérif blazer (seulement si renseigné)
    if (blazer) {
      const blazerFound = costumeData.blazerSize?.some(
        (s: any) => s.size === blazer
      );

      if (!blazerFound) {
        return {
          ok: false,
          message: `❌ Blazer taille ${blazer} non disponible dans ce modèle`,
        };
      }

      const blazerUnavailable = costumeData.blazerSize?.some(
        (s: any) =>
          s.size === blazer &&
          s.location_date?.some((d: Date) =>
            isDateInInterval(new Date(d), start, end)
          )
      );

      if (blazerUnavailable) {
        return {
          ok: false,
          message: `❌ Blazer taille ${blazer} indisponible entre le ${start.getDate()} et le ${end.getDate()}`,
        };
      }
    }

    // 🔹 Vérif pantalon (seulement si renseigné)
    if (pant) {
      const pantFound = costumeData.pantSize?.some(
        (s: any) => s.size === pant
      );

      if (!pantFound) {
        return {
          ok: false,
          message: `❌ Pantalon taille ${pant} non disponible dans ce modèle`,
        };
      }

      const pantUnavailable = costumeData.pantSize?.some(
        (s: any) =>
          s.size === pant &&
          s.location_date?.some((d: Date) =>
            isDateInInterval(new Date(d), start, end)
          )
      );

      if (pantUnavailable) {
        return {
          ok: false,
          message: `❌ Pantalon taille ${pant} indisponible entre le ${start.getDate()} et le ${end.getDate()}`,
        };
      }
    }

    // ✅ Tout est bon (ou les champs vides ont été ignorés)
    return { ok: true };
  } catch (err: any) {
    console.error("Erreur checkAvailability:", err);
    return { ok: false, message: "❌ Erreur interne lors de la vérification." };
  }
}