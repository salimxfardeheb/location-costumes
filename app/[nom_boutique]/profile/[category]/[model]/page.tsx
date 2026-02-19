import React from "react";
import { get_one_category_cloth } from "@/app/firebase/getCategoryCloth";
import { deleteModel } from "@/app/firebase/deleteModel";
import Link from "next/link";
import { redirect } from "next/navigation";
import { size } from "@/app/functions";
import { FiArrowLeft, FiTrash2, FiPackage, FiInfo } from "react-icons/fi";

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

  if (!result) return null;

  const handleDelete = async () => {
    "use server";
    await deleteModel(category, decodedModel);
    redirect(`/${nom_boutique}/profile/${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <Link
          href={`/${nom_boutique}/profile/${category}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg mb-6 border border-gray-200"
        >
          <FiArrowLeft className="text-lg" />
          <span className="font-semibold">Retour à la liste</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={result.image_path || "/placeholder.png"}
                alt={result.model}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Détails */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FiPackage className="text-[#000c79] text-2xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase">{category}</p>
                  <h1 className="text-3xl font-bold text-gray-800">{result.model}</h1>
                </div>
              </div>
            </div>

            {/* Tailles Blazer (Costume) */}
            {category === "costume" && result.blazerSize && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FiInfo className="text-purple-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Tailles disponibles des blazers</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.blazerSize.map((size: size, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 px-5 py-3 rounded-xl font-bold text-[#000c79] text-lg shadow-sm hover:shadow-md transition-all"
                    >
                      {size.size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tailles Pantalon (Costume) */}
            {category === "costume" && result.pantSize && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <FiInfo className="text-indigo-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Tailles disponibles des pantalons</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.pantSize.map((size: size, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 px-5 py-3 rounded-xl font-bold text-indigo-700 text-lg shadow-sm hover:shadow-md transition-all"
                    >
                      {size.size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tailles/Pointures (Chemise/Chaussure) */}
            {(category === "chemise" || category === "chaussure") && result.size && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <FiInfo className="text-emerald-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {category === "chemise" ? "Tailles disponibles" : "Pointures disponibles"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.size.map((size: size, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 px-5 py-3 rounded-xl font-bold text-emerald-700 text-lg shadow-sm hover:shadow-md transition-all"
                    >
                      {size.size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description (Accessoire) */}
            {category === "accessoire" && result.description && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FiInfo className="text-amber-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Description</h2>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {result.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Actions</h2>
              <form action={handleDelete}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <FiTrash2 className="text-lg" />
                  Supprimer le modèle
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;