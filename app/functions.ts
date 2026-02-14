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

export type Costume = {
  ref: string;
  model: string;
  blazer: string;
  pant: string;
  image?: string;
};

export type Chemise = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

export type Chaussure = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

export type Accessoire = {
  ref: string;
  model: string;
  image?: string;
  description? : string
};

export type Client = {
  name: string;
  phone: string;
  vers: number;
  rest: number;
  comment : string;
};

export type Location = {
  location_date: Date;
  id: string;
  date_sortie: Date | string;
  costumes: Costume[];
  chemise: Chemise | null;
  chaussure: Chaussure | null;
  accessories: Accessoire[];
  client: Client | null;
};

export const categories = ["costume", "chemise", "chaussure", "accessoire"];
