"use server";
import { get_one_location } from "@/app/firebase/getLocations";
import DeleteLocationButton from "@/app/[nom_boutique]/components/deleteLocationButton"
import Link from "next/link";
import React from "react";
import {
  FiCalendar,
  FiUser,
  FiPhone,
  FiEdit,
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
  FiFileText
} from "react-icons/fi";

interface Props {
  params: {
    nom_boutique: any;
    location: any;
  };
}

const Page = async ({ params }: Props): Promise<any> => {
  const { nom_boutique, location } = await params;
  const result = await get_one_location(location);

  // Calcul du total des articles
  const totalItems =
    (result?.costumes?.length || 0) +
    (result?.chemise ? 1 : 0) +
    (result?.chaussure ? 1 : 0) +
    (result?.accessories?.length || 0);

  const isFullyPaid = result?.client?.rest === 0 || !result?.client?.rest;

  // Calcul des jours restants
  const getDaysRemaining = (dateStr: any) => {
    if (!dateStr) return null;
    const exitDate = dateStr instanceof Date ? dateStr : new Date(dateStr);
    const today = new Date();
    const diffTime = exitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(result?.date_sortie);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fadeIn">
          <Link
            href={`/${nom_boutique}/dashboard`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95 border border-gray-200"
          >
            <FiArrowLeft className="text-lg" />
            <span className="font-semibold">Retour au tableau de bord</span>
          </Link>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href={`/${nom_boutique}/dashboard/${location}/editLocation`}
              className="bg-white text-[#000c79] hover:outline-2 hover:outline-[#000c79] font-semibold px-6 py-3 rounded-xl active:scale-95  flex items-center gap-2 shadow-lg group duration-100 transition-normal"
            >
              <FiEdit className="text-lg group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Modifier</span>
            </Link>
            <DeleteLocationButton nom_boutique={nom_boutique} idLocation={location}/>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Date de sortie */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-5 text-white animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <FiCalendar className="text-2xl opacity-90" />
              <p className="text-sm font-medium opacity-90">Date de sortie</p>
            </div>
            <p className="text-2xl font-bold mb-1">
              {result?.date_sortie instanceof Date
                ? result.date_sortie.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })
                : result?.date_sortie}
            </p>
            {daysRemaining !== null && (
              <div className="flex items-center gap-1 mt-2">
                <FiClock className="text-sm" />
                <p className="text-xs opacity-90">
                  {daysRemaining > 0
                    ? `Dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""}`
                    : daysRemaining === 0
                      ? "Aujourd'hui"
                      : `Passé il y a ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? "s" : ""}`}
                </p>
              </div>
            )}
          </div>

          {/* Total articles */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiPackage className="text-purple-600 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Articles loués
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
          </div>

          {/* Versement */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <FiCheckCircle className="text-emerald-600 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600">Versé</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {result?.client?.vers || 0} <span className="text-lg">DA</span>
            </p>
          </div>

          {/* Reste */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${isFullyPaid ? "bg-green-100" : "bg-orange-100"}`}
              >
                <FiAlertCircle
                  className={`text-xl ${isFullyPaid ? "text-green-600" : "text-orange-600"}`}
                />
              </div>
              <p className="text-sm font-medium text-gray-600">Reste</p>
            </div>
            <p
              className={`text-3xl font-bold ${isFullyPaid ? "text-green-600" : "text-orange-600"}`}
            >
              {result?.client?.rest || 0} <span className="text-lg">DA</span>
            </p>
          </div>
        </div>

        {/* Informations Client */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-6 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/10 p-3 rounded-xl">
              <FiUser className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Informations Client
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ">
              {/* Nom du client */}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                <div className="bg-blue-600 p-3 rounded-xl shadow-md">
                  <FiUser className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Nom du client
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {result?.client?.name || (
                      <span className="text-gray-400 italic">
                        Non renseigné
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100">
                <div className="bg-green-600 p-3 rounded-xl shadow-md">
                  <FiPhone className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Téléphone
                  </p>
                  <p className="text-lg font-bold text-gray-800 font-mono">
                    {result?.client?.phone || (
                      <span className="text-gray-400 italic">
                        Non renseigné
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {/* Commentaire sur le client */}
            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-sky-50 to-white rounded-2xl border border-green-100">
              <div className="bg-sky-400 p-3 rounded-xl shadow-md">
                <FiFileText className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                  Commentaire
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {result?.client?.comment || (
                    <span className="text-gray-400 italic">Non renseigné</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles loués */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Articles loués</h2>
            <div className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="text-blue-700 font-bold text-sm">
                {totalItems} article{totalItems > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-500 font-medium">Aucun article loué</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Costumes */}
              {result?.costumes?.map((model, i) => (
                <div
                  key={i}
                  className="group bg-gradient-to-br from-blue-50 via-white to-blue-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.model}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Costume
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Modèle
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {model.model}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">
                        Blazer
                      </span>
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {model.blazer}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">
                        Pantalon
                      </span>
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {model.pant}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Chemise */}
              {result?.chemise && (
                <div className="group bg-gradient-to-br from-purple-50 via-white to-purple-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={result.chemise.image}
                      alt={result.chemise.model}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Chemise
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Modèle
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {result.chemise.model}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">
                        Taille
                      </span>
                      <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {result.chemise.size}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chaussure */}
              {result?.chaussure && (
                <div className="group bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={result.chaussure.image}
                      alt={result.chaussure.model}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Chaussure
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Modèle
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {result.chaussure.model}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">
                        Pointure
                      </span>
                      <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {result.chaussure.size}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Accessoires */}
              {result?.accessories?.map((model, i) => (
                <div
                  key={i}
                  className="group bg-gradient-to-br from-pink-50 via-white to-pink-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-pink-100 hover:border-pink-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.model}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Accessoire
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Modèle
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {model.model}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500">
                        Description
                      </span>
                      <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {model.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
