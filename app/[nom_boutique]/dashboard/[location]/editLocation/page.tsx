"use server";
import { get_one_location } from "@/app/firebase/getLocations";
import EditLocationForm from "@/app/[nom_boutique]/components/EditLocationForm";

interface Props {
  params: {
    nom_boutique: string;
    location: string;
  };
}

const Page = async ({ params }: Props) => {
  const { nom_boutique, location } = await params;
  const rawData = await get_one_location(location);

  if (!rawData) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-600 text-xl">Location introuvable</p>
    </div>
  );
}
  // 🔥 Nettoyage pour éviter les objets non sérialisables
const initialData = JSON.parse(JSON.stringify({
  ...rawData,
  date_sortie:
    rawData.date_sortie && typeof rawData.date_sortie === 'object' && 'toDate' in rawData.date_sortie
      ? (rawData.date_sortie as any).toDate().toISOString()
      : rawData.date_sortie,
}));

  return (
    <EditLocationForm initialData={initialData} locationId={location} nomBoutique={nom_boutique}/>
  );
};

export default Page;