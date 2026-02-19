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

export interface ItemCloth {
  model: string;
  blazer?: string;
  pant?: string;
  size?: string;
  image?: string;
}

export interface LocationInput {
  location_date: Date;
  costume?: ItemCloth[];
  chemise?: ItemCloth;
  chaussure?: ItemCloth;
  accessoire?: ItemCloth[];
  client: Client;
  total : number
}

export interface collection_item {
  type_collection: string; // all
  model: string; // all
  image_path: string; // all
  blazer?: size[]; // costume
  pant?: size[]; // costume
  size?: size[]; // shirt & shoe
  description?: string; // accessoire
}

export interface size {
  size: string;
  location_date: Date[];
}


export type Costume = {
  ref: string | null;      
  model: string;
  blazer: string;
  pant: string;
  image?: string;
};

export type Chemise = {
  ref: string | null;
  model: string;
  size: string;
  image?: string;
};

export type Chaussure = {
  ref: string | null;
  model: string;
  size: string;
  image?: string;
};

export type Accessoire = {
  ref: string | null;
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
  id: string;
  location_date: Date;
  costumes: Costume[];
  chemise: Chemise | null;
  chaussure: Chaussure | null;
  accessories: Accessoire[];
  client: Client | null;
  total : number;
};

export const categories = ["costume", "chemise", "chaussure", "accessoire"];
