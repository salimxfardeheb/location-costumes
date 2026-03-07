"use server";

import { get_locations } from "@/app/firebase/getLocations";
import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiEye, FiCalendar, FiUser, FiPlus } from "react-icons/fi";

export default async function Dashboard(props: {
  params: Promise<{ nom_boutique: string }>;
  searchParams: Promise<{ all?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const showAll = searchParams.all === "true";
  const { nom_boutique } = params;

  const result = await get_locations(showAll);
  const sortLocationsByDate = result.sort(
    (a, b) =>
      new Date(a.location_date).getTime() - new Date(b.location_date).getTime()
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {showAll ? "Toutes les locations" : "Locations à venir"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {sortLocationsByDate.length} location(s) au total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${nom_boutique}/dashboard?all=${!showAll}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#000c79] text-[#000c79] font-semibold text-sm hover:bg-[#000c79] hover:text-white transition-all duration-200 active:scale-95"
            >
              <FiEye className="text-base" />
              <span>{showAll ? "À venir" : "Voir tout"}</span>
            </Link>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#000c79] text-white">
                {["Client", "Téléphone", "Date Sortie", "Articles", "Versement", "Reste"].map((col) => (
                  <th key={col} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortLocationsByDate.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                sortLocationsByDate.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-blue-50/60 transition-colors duration-150 group"
                  >
                    <td className="p-0" colSpan={6}>
                      <Link
                        href={`/${nom_boutique}/dashboard/${data.id}`}
                        className="grid grid-cols-6 items-center w-full"
                      >
                        {/* Client */}
                        <div className="px-5 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#000c79]/10 flex items-center justify-center shrink-0 group-hover:bg-[#000c79]/20 transition-colors">
                            <FiUser className="text-[#000c79] text-sm" />
                          </div>
                          <span className="font-semibold text-gray-800 text-sm truncate">
                            {data.client?.name || <span className="text-gray-400 italic font-normal">—</span>}
                          </span>
                        </div>

                        {/* Téléphone */}
                        <div className="px-5 py-4">
                          <span className="text-gray-600 text-sm font-mono">
                            {data.client?.phone || <span className="text-gray-400 italic">—</span>}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="px-5 py-4 flex items-center gap-2">
                          <FiCalendar className="text-[#06B9AE] shrink-0" />
                          <span className="text-gray-800 text-sm font-medium">
                            {data.location_date instanceof Date
                              ? data.location_date.toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : data.location_date}
                          </span>
                        </div>

                        {/* Articles (costume + chemise + chaussure résumé) */}
                        <div className="px-5 py-4 flex flex-wrap gap-1">
                          {data.costumes?.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {c.model}
                            </span>
                          ))}
                          {data.chemise && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {data.chemise.model}
                            </span>
                          )}
                          {data.chaussure && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                              {data.chaussure.model}
                            </span>
                          )}
                          {data.accessories?.map((a, i) => (
                            <span key={i} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                              {a.model}
                            </span>
                          ))}
                          {!data.costumes?.length && !data.chemise && !data.chaussure && !data.accessories?.length && (
                            <span className="text-gray-400 italic text-sm">—</span>
                          )}
                        </div>

                        {/* Versement */}
                        <div className="px-5 py-4">
                          {data.client?.vers ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold text-sm">
                              {data.client.vers} DA
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-sm">—</span>
                          )}
                        </div>

                        {/* Reste */}
                        <div className="px-5 py-4">
                          {data.client?.rest != null ? (
                            <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                              data.client.rest === 0
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}>
                              {data.client.rest} DA
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-sm">—</span>
                          )}
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {sortLocationsByDate.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
              <EmptyState />
            </div>
          ) : (
            sortLocationsByDate.map((data) => (
              <Link
                key={data.id}
                href={`/${nom_boutique}/dashboard/${data.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-[#000c79]/30 transition-all duration-200 active:scale-[0.99]"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#000c79]/10 flex items-center justify-center shrink-0">
                      <FiUser className="text-[#000c79]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {data.client?.name || <span className="text-gray-400 italic font-normal">Aucun nom</span>}
                      </p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">
                        {data.client?.phone || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#06B9AE] bg-[#06B9AE]/10 px-2.5 py-1 rounded-lg">
                    <FiCalendar className="text-xs" />
                    <span className="text-xs font-semibold text-gray-700">
                      {data.location_date instanceof Date
                        ? data.location_date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })
                        : data.location_date}
                    </span>
                  </div>
                </div>

                {/* Articles */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {data.costumes?.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{c.model}</span>
                  ))}
                  {data.chemise && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{data.chemise.model}</span>
                  )}
                  {data.chaussure && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{data.chaussure.model}</span>
                  )}
                  {data.accessories?.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">{a.model}</span>
                  ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Versement :</span>
                    {data.client?.vers ? (
                      <span className="text-xs font-bold text-green-700">{data.client.vers} DA</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Reste :</span>
                    {data.client?.rest != null ? (
                      <span className={`text-xs font-bold ${data.client.rest === 0 ? "text-green-700" : "text-orange-600"}`}>
                        {data.client.rest} DA
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <IoInformationCircleOutline className="text-gray-400 text-3xl" />
      </div>
      <p className="text-gray-600 font-semibold">Aucune location trouvée</p>
      <p className="text-gray-400 text-sm">Commencez par ajouter une nouvelle location</p>
    </div>
  );
}