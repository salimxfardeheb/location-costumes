"use server";

import { get_one_category_cloth } from "./getCategoryCloth";

type AvailabilityResult = {
  missingModel: boolean;
  missingCostumeBlazer: boolean;
  missingCostumePant: boolean;
  blazerLocate: boolean;
  pantLocate: boolean;
};

export async function checkAvailability(
  model: string,
  blazer: string,
  pant: string,
  location_date: string
): Promise<AvailabilityResult> {
  const costumeData = await get_one_category_cloth("costume", model);

  let missingModel = false;
  let missingCostumeBlazer = false;
  let missingCostumePant = false;
  let blazerLocate = false;
  let pantLocate = false;

  if (!model) {
    missingModel = true;
  }
  // --- Vérif blazer ---
  if (!blazer) {
    missingCostumeBlazer = true;
  } else {
    const blazerFound = costumeData.blazerSize?.some(
      (s: any) => s.size === blazer
    );
    if (!blazerFound) {
      missingCostumeBlazer = true;
    } else {
      costumeData.blazerSize.forEach((s: any) => {
        if (s.size === blazer && s.location_date.includes(location_date)) {
          blazerLocate = true;
        }
      });
    }
  }

  // --- Vérif pant ---
  if (!pant) {
    missingCostumePant = true;
  } else {
    const pantFound = costumeData.pantSize?.some((s: any) => s.size === pant);
    if (!pantFound) {
      missingCostumePant = true;
    } else {
      costumeData.pantSize.forEach((s: any) => {
        if (s.size === pant && s.location_date.includes(location_date)) {
          pantLocate = true;
        }
      });
    }
  }

  return {
    missingModel,
    missingCostumeBlazer,
    missingCostumePant,
    blazerLocate,
    pantLocate,
  };
}
