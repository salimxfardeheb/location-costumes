import { NextResponse } from "next/server";
import { get_locations } from "@/app/firebase/getLocations";

export async function GET() {
  try {
    const locations = await get_locations(true); // showAll = true
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Erreur API locations:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
