// app/api/location/route.ts
import { NextResponse } from "next/server";
import { create_location } from "@/app/firebase/createLocation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const location = await create_location(body);
    return NextResponse.json({ success: true, location });
  } catch (err : any) {
    console.error("❌ API error:", err.message);
    return NextResponse.json(
      { success: false, error:  err.message },
      { status: 500 }
    );
  }
}
