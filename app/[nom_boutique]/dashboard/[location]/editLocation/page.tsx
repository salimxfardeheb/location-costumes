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
  // Nettoyage pour éviter les objets non sérialisables
const initialData = JSON.parse(JSON.stringify({
  ...rawData,
  date_sortie:
    rawData.location_date && typeof rawData.location_date === 'object' && 'toDate' in rawData.location_date
      ? (rawData.location_date as any).toDate().toISOString()
      : rawData.location_date,
}));

  return (
    <EditLocationForm initialData={initialData} locationId={location} nomBoutique={nom_boutique}/>
  );
};

export default Page;