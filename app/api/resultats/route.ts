import { NextResponse } from "next/server";
import { get_location_perDate } from "@/app/firebase/getLocations";
import { get_one_category_cloth } from "@/app/firebase/getCategoryCloth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const category = searchParams.get("category");

    if (!date || !category) {
      return NextResponse.json(
        { success: false, error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const locations = await get_location_perDate(date);

    let enriched: any[] = [];

    for (const loc of locations) {
      if (category === "costume" && loc.costumes?.length > 0) {
        for (const cos of loc.costumes) {
          const costume = await get_one_category_cloth("costume", cos.model);
          if (costume) enriched.push(costume);
        }
      }

      if (category === "chemise" && loc.chemise) {
        const chemise = await get_one_category_cloth("chemise", loc.chemise.model);
        if (chemise) enriched.push(chemise);
      }

      if (category === "chaussure" && loc.chaussure) {
        const shoe = await get_one_category_cloth("chaussure", loc.chaussure.model);
        if (shoe) enriched.push(shoe);
      }

      if (category === "accessoire" && loc.accessories?.length > 0) {
        for (const acc of loc.accessories) {
          const accessoire = await get_one_category_cloth("accessoire", acc.model);
          if (accessoire) enriched.push(accessoire);
        }
      }
    }

    const unique = enriched.filter(
      (v, i, a) => a.findIndex(t => t.model === v.model) === i
    );

    return NextResponse.json({ success: true, data: unique });
  } catch (error: any) {
    console.error("Erreur API resultats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
