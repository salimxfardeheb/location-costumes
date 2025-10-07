export async function handleUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (url: string) => void,
  setUploadedUrl: (url: string) => void,
  boutiqueId: string
) {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setPreview(url);

  const formData = new FormData();
  formData.append("image", file);
  if (boutiqueId) formData.append("boutiqueId", boutiqueId);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Erreur d’upload :", err);
    return;
  }

  const data = await res.json();
  setUploadedUrl(data.url);
}

export const categories = ["costume", "chemise", "chaussure", "accessoire"];
