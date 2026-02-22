import { NextResponse } from "next/server";
import { edit_location } from "@/app/firebase/editLocation";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const location = await edit_location(body);
    return NextResponse.json({ success: true, location });
  } catch (err: any) {
    console.error("❌ API editLocation error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}