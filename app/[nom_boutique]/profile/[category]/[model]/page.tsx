import React from "react";
import { get_one_category_cloth } from "@/app/firebase/getCategoryCloth";
import { deleteModel } from "@/app/firebase/deleteModel";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  params: {
    nom_boutique: any;
    category: string;
    model: string;
  };
}

const Page = async ({ params }: Props) => {
  const { category, model, nom_boutique } = await params;
  const decodedModel = decodeURIComponent(model);
  const result = await get_one_category_cloth(category, decodedModel);

  if (!result) return;

  const handleDelete = async () => {
    "use server";
    await deleteModel(category, decodedModel);
    redirect(`/${nom_boutique}/profile/${category}`);
  };

  return (
    <>
      <div className="flex gap-6 w-3/4 mx-auto ">
        <img
          src={result.image_path || "/placeholder.png"}
          alt={result.model}
          className="max-w-80 object-cover rounded-xl"
        />
        <div className="flex flex-col pt-10 gap-6">
          <h1 className="text-2xl font-bold">
            Détail du modèle {result.model}
          </h1>
          {category === "costume" && (
            <div className="sizes-big-container">
              <p>Taille disponibles des blazers :</p>
              <div className="sizes-container">
                {result.blazerSize.map((size: string, i: number) => (
                  <div key={i} className="sizes-details">
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
          {category === "costume" && (
            <div className="sizes-big-container">
              <p>Taille disponibles des pantallons :</p>
              <div className="sizes-container">
                {result.pantSize.map((size: string, i: number) => (
                  <div key={i} className="sizes-details">
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(category === "shirt" || category === "shoe") && (
            <div className="sizes-big-container">
              <div>
                {category === "shirt" && (
                  <p>Taille disponibles des chemise :</p>
                )}
                {category === "shoe" && <p>pointure disponibles :</p>}
              </div>
              <div className="sizes-container">
                {result.size.map((size: string, i: number) => (
                  <div key={i} className="sizes-details">
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
          {category === "accessory" && (
            <div className="flex items-center gap-6 font-semibold">
              <p>Description : </p>
              {result.description}
            </div>
          )}
          <form action={handleDelete}>
            <button
              type="submit"
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:opacity-85 mt-5 cursor-pointer"
            >
              Supprimer le modèle
            </button>
          </form>
          <div className="w-full h-full flex justify-end items-end">
            <Link
              href={`/${nom_boutique}/profile/${category}`}
              className="mt-5 px-4 py-2 h-fit bg-gray-600 text-white rounded-lg hover:opacity-85 w-fit justify-end"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
