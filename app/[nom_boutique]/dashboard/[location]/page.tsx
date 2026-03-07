import { get_one_location } from "@/app/firebase/getLocations";
import DeleteLocationButton from "@/app/[nom_boutique]/components/deleteLocationButton";
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
  FiFileText,
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

  const totalItems =
    (result?.costumes?.length || 0) +
    (result?.chemise ? 1 : 0) +
    (result?.chaussure ? 1 : 0) +
    (result?.accessories?.length || 0);

  const isFullyPaid = result?.client?.rest === 0 || !result?.client?.rest;

  const getDaysRemaining = (dateStr: any) => {
    if (!dateStr) return null;
    const exitDate = dateStr instanceof Date ? dateStr : new Date(dateStr);
    const today = new Date();
    const diffTime = exitDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(result?.location_date);

  const dayLabel =
    daysRemaining === null
      ? null
      : daysRemaining > 0
        ? `Dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""}`
        : daysRemaining === 0
          ? "Aujourd'hui"
          : `Passé il y a ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? "s" : ""}`;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href={`/${nom_boutique}/dashboard`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-semibold active:scale-95"
          >
            <FiArrowLeft />
            Retour
          </Link>

          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href={`/${nom_boutique}/dashboard/${location}/editLocation`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#000c79] text-[#000c79] rounded-xl font-semibold text-sm hover:bg-[#000c79] hover:text-white transition-all duration-200 active:scale-95"
            >
              <FiEdit />
              Modifier
            </Link>
            <DeleteLocationButton nom_boutique={nom_boutique} idLocation={location} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Date */}
          <div className="bg-[#000c79] rounded-2xl p-4 md:p-5 text-white col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="opacity-80" />
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">Date sortie</p>
            </div>
            <p className="text-xl md:text-2xl font-bold leading-tight">
              {result?.location_date instanceof Date
                ? result.location_date.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : result?.location_date}
            </p>
            {dayLabel && (
              <div className="flex items-center gap-1.5 mt-2 bg-white/15 rounded-lg px-2.5 py-1.5 w-fit">
                <FiClock className="text-xs" />
                <p className="text-xs font-medium">{dayLabel}</p>
              </div>
            )}
          </div>

          {/* Articles */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-100 p-1.5 rounded-lg">
                <FiPackage className="text-purple-600 text-sm" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Articles</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{totalItems}</p>
          </div>

          {/* Versé */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-100 p-1.5 rounded-lg">
                <FiCheckCircle className="text-emerald-600 text-sm" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Versé</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">
              {result?.client?.vers || 0}
              <span className="text-base font-medium ml-1 text-emerald-500">DA</span>
            </p>
          </div>

          {/* Reste */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-lg ${isFullyPaid ? "bg-green-100" : "bg-orange-100"}`}>
                <FiAlertCircle className={`text-sm ${isFullyPaid ? "text-green-600" : "text-orange-500"}`} />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reste</p>
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${isFullyPaid ? "text-green-600" : "text-orange-500"}`}>
              {result?.client?.rest || 0}
              <span className="text-base font-medium ml-1">DA</span>
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#000c79]/10 p-2.5 rounded-xl">
              <FiUser className="text-[#000c79] text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Informations Client</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <InfoCard
              icon={<FiUser className="text-white" />}
              iconBg="bg-[#000c79]"
              label="Nom du client"
              value={result?.client?.name}
            />
            <InfoCard
              icon={<FiPhone className="text-white" />}
              iconBg="bg-green-600"
              label="Téléphone"
              value={result?.client?.phone}
              mono
            />
            <div className="sm:col-span-2">
              <InfoCard
                icon={<FiFileText className="text-white" />}
                iconBg="bg-sky-400"
                label="Commentaire"
                value={result?.client?.comment}
              />
            </div>
          </div>
        </div>

        {/* Articles loués */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <FiPackage className="text-purple-600 text-lg" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Articles loués</h2>
            </div>
            <span className="bg-[#000c79]/10 text-[#000c79] font-bold text-sm px-3 py-1 rounded-full">
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </span>
          </div>

          {totalItems === 0 ? (
            <div className="text-center py-14">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiPackage className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium">Aucun article loué</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {result?.costumes?.map((model, i) => (
                <ArticleCard
                  key={i}
                  image={model.image}
                  alt={model.model}
                  badge="Costume"
                  badgeColor="bg-[#000c79]"
                  borderColor="border-blue-100 hover:border-blue-300"
                  fields={[
                    { label: "Modèle", value: model.model },
                    { label: "Blazer", value: model.blazer, accent: "text-[#000c79] bg-blue-50" },
                    { label: "Pantalon", value: model.pant, accent: "text-[#000c79] bg-blue-50" },
                  ]}
                />
              ))}

              {result?.chemise && (
                <ArticleCard
                  image={result.chemise.image}
                  alt={result.chemise.model}
                  badge="Chemise"
                  badgeColor="bg-purple-600"
                  borderColor="border-purple-100 hover:border-purple-300"
                  fields={[
                    { label: "Modèle", value: result.chemise.model },
                    { label: "Taille", value: result.chemise.size, accent: "text-purple-600 bg-purple-50" },
                  ]}
                />
              )}

              {result?.chaussure && (
                <ArticleCard
                  image={result.chaussure.image}
                  alt={result.chaussure.model}
                  badge="Chaussure"
                  badgeColor="bg-amber-500"
                  borderColor="border-amber-100 hover:border-amber-300"
                  fields={[
                    { label: "Modèle", value: result.chaussure.model },
                    { label: "Pointure", value: result.chaussure.size, accent: "text-amber-600 bg-amber-50" },
                  ]}
                />
              )}

              {result?.accessories?.map((model, i) => (
                <ArticleCard
                  key={i}
                  image={model.image}
                  alt={model.model}
                  badge="Accessoire"
                  badgeColor="bg-pink-600"
                  borderColor="border-pink-100 hover:border-pink-300"
                  fields={[
                    { label: "Modèle", value: model.model },
                    { label: "Description", value: model.description, accent: "text-pink-600 bg-pink-50" },
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Composants utilitaires ── */

function InfoCard({
  icon,
  iconBg,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className={`${iconBg} p-2.5 rounded-xl shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-gray-800 truncate ${mono ? "font-mono" : ""}`}>
          {value || <span className="text-gray-400 italic font-normal">Non renseigné</span>}
        </p>
      </div>
    </div>
  );
}

function ArticleCard({
  image,
  alt,
  badge,
  badgeColor,
  borderColor,
  fields,
}: {
  image?: string;
  alt?: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  fields: { label: string; value?: string; accent?: string }[];
}) {
  return (
    <div className={`group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${borderColor}`}>
      <div className="relative overflow-hidden h-52">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 ${badgeColor} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow`}>
          {badge}
        </span>
      </div>
      <div className="p-4 space-y-2">
        {fields.map((f, i) => (
          <div key={i} className={`flex justify-between items-center ${i === 0 ? "pb-2 border-b border-gray-100" : ""}`}>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${f.accent || "text-gray-800"}`}>
              {f.value || <span className="text-gray-400 italic font-normal">—</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;