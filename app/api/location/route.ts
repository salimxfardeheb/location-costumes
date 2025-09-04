// app/api/location/route.ts
import { NextResponse } from "next/server";
import { create_location } from "@/app/actions/firebase/createLocation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const location = await create_location(body);
    return NextResponse.json({ success: true, location });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
