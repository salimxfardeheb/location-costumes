import React from "react";
import { get_one_category_cloth } from "@/app/actions/firebase/getCategoryCloth"
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  params: {
    nom_boutique: any; category: string; model: string 
};
}

const Page = async ({ params }: Props) => {
  const { category, model } = await params;
  const decodedModel = decodeURIComponent(model);
  const result = await get_one_category_cloth(category, decodedModel);

  if (!result) return;

  /*const handleDelete = async () => {
    "use server";
    await DeleteModel(category, decodedModel);
    redirect(`/${params.nom_boutique}/profile/${params.category}`)
  };*/

  return (
    <>
      <div className="flex gap-6 ">
        <img
          src={result.image || "/placeholder.png"}
          alt={result.model}
          className="max-w-80 object-cover rounded-xl"
        />
        <div className="flex flex-col py-10 gap-6">
          <h1 className="text-2xl font-bold">
            Détail du modèle {result.model}
          </h1>
          {category === "costume" && (
            <div className="flex justify-between items-center gap-6 font-semibold">
              <p>Taille disponibles des blazers :</p>
              {result.blazer.map((size: string, i: number) => (
                <div key={i} className="border-2 p-1 rounded-sm">
                  {size}
                </div>
              ))}
            </div>
          )}
          {category === "costume" && (
            <div className="flex justify-between items-center gap-6 font-semibold">
              <p>Taille disponibles des pantallons :</p>
              {result.pants.map((size: string, i: number) => (
                <div key={i} className="border-2 p-1 rounded-sm">
                  {size}
                </div>
              ))}
            </div>
          )}
          {(category === "shirt" || category === "shoe") && (
            <div className="flex justify-between items-center gap-6 font-semibold">
              <div>
                {category === "shirt" && (
                  <p>Taille disponibles des chemise :</p>
                )}
                {category === "shoe" && <p>pointure disponibles :</p>}
              </div>
              {result.size.map((size: string, i: number) => (
                <div key={i} className="border-2 p-1 rounded-sm">
                  {size}
                </div>
              ))}
            </div>
          )}
          {category === "accessory" && (
            <div className="flex items-center gap-6 font-semibold">
              <p>Description : </p>
              {result.description}
            </div>
          )}
          <form>
            <button
              type="submit"
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:opacity-85 mt-5 cursor-pointer"
            >
              Supprimer le modèle
            </button>
          </form>
        </div>
      </div>
      <Link
        href={`/${params.nom_boutique}/profile/${params.category}`}
        className="mt-5 px-4 py-2 h-fit bg-gray-600 text-white rounded-lg hover:opacity-85"
      >
        Retour à la liste
      </Link>
    </>
  );
};

export default Page;
