import { NextResponse } from "next/server";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage} from "@/lib/firebase/connect"

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const boutiqueId = formData.get("boutiqueId") as string;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `boutiques/${boutiqueId || "general"}/${fileName}`;

    const imageRef = ref(storage, filePath);
    await uploadBytes(imageRef, buffer);

    const downloadUrl = await getDownloadURL(imageRef);

    return NextResponse.json({
      message: "Image uploadée avec succès",
      url: downloadUrl,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload Firebase :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload Firebase" },
      { status: 500 }
    );
  }
}
