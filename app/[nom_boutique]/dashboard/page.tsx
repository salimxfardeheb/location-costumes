"use server";

import { get_locations } from "@/app/firebase/getLocations";
import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiEye, FiCalendar, FiUser } from "react-icons/fi";

export default async function Dashboard(props: {
  params: Promise<{ nom_boutique: string }>;
  searchParams: Promise<{ all?: string }>;
}) {
  const rows = [
    "Client",
    "Téléphone",
    "Date Sortie",
    "Costume",
    "Chemise",
    "Chaussure",
    "Accessoires",
    "Versement",
    "Rest",
  ];
  const params = await props.params;
  const searchParams = await props.searchParams;

  const showAll = searchParams.all === "true";
  const { nom_boutique } = params;

  const result = await get_locations(showAll);
  const sortLocationsByDate = result.sort(
    (a, b) => a.date_sortie.getTime() - b.date_sortie.getTime(),
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-full mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className=" px-8 py-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <FiCalendar className="text-black text-2xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {showAll ? "Toutes les locations" : "Locations à venir"}
                  </p>
                  <p className="text-black/80 text-sm mt-1">
                    {sortLocationsByDate.length} location(s) au total
                  </p>
                </div>
              </div>

              <Link
                href={`/${nom_boutique}/dashboard?all=${!showAll}`}
                className="bg-white text-[#000c79] hover:border-2 hover:border-[#000c79] font-semibold px-6 py-3 rounded-xl active:scale-95  flex items-center gap-2 shadow-lg group"
              >
                <FiEye className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-sm">
                  {showAll ? "Voir uniquement à venir" : "Voir tout"}
                </span>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r grid grid-cols-9 from-[#000c79] via-[#000a35] to-[#000c79] text-white">
                  {rows.map((col, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-start font-semibold text-xs uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortLocationsByDate.length === 0 ? (
                  <tr>
                    <td colSpan={rows.length} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <IoInformationCircleOutline className="text-gray-400 text-5xl" />
                        </div>
                        <p className="text-gray-500 font-medium text-md">
                          Aucune location trouvée
                        </p>
                        <p className="text-gray-400 text-sm">
                          Commencez par ajouter une nouvelle location
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortLocationsByDate.map((data, i) => (
                    <tr
                      key={data.id}
                      className="hover:bg-blue-800/10 transition-all duration-200 group"
                    >
                      <td colSpan={rows.length} className="p-0">
                        <Link
                          href={`/${nom_boutique}/dashboard/${data.id}`}
                          className="grid grid-cols-9 px-5 w-full"
                        >
                          <div className="px-2 py-4 flex items-center gap-2">
                            <div className="bg-[#000c79]/10 p-2 rounded-lg group-hover:bg-[#000c79]/20 transition-colors">
                              <FiUser className="text-[#000c79]" />
                            </div>
                            <span className="font-medium text-gray-800">
                              {data.client?.name || (
                                <span className="text-gray-400 italic">
                                  Aucun nom
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="px-2 py-4 flex items-center">
                            <span className="text-gray-700 font-mono text-sm">
                              {data.client?.phone || (
                                <span className="text-gray-400 italic">
                                  Aucun numéro
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="px-2 py-4 flex items-center gap-2">
                            <FiCalendar className="text-[#06B9AE]" />
                            <span className="font-medium text-gray-800">
                              {data.date_sortie instanceof Date
                                ? data.date_sortie.toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : data.date_sortie}
                            </span>
                          </div>

                          <div className="px-6 py-4 flex items-center">
                            {data.costumes && data.costumes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {data.costumes.map((model, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                                  >
                                    {model.model}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucun costume
                              </span>
                            )}
                          </div>

                          <div className="px-2 py-4 flex items-center">
                            {data.chemise ? (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {data.chemise.model}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucune chemise
                              </span>
                            )}
                          </div>

                          <div className="px-2 py-4 flex items-center">
                            {data.chaussure ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                {data.chaussure.model}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucune chaussure
                              </span>
                            )}
                          </div>

                          <div className="px-2 py-4 flex items-center">
                            {data.accessories && data.accessories.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {data.accessories.map((model, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold"
                                  >
                                    {model.model}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucun accessoire
                              </span>
                            )}
                          </div>
                          <div className="px-2 py-4 flex items-center">
                            {data.client?.vers ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold text-sm">
                                {data.client.vers} DA
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucun versement
                              </span>
                            )}
                          </div>

                          <div className="px-2 py-4 flex items-center">
                            {data.client?.rest || data.client?.rest == 0  ? (
                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-semibold text-sm">
                                {data.client.rest} DA
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Aucun reste
                              </span>
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
        </div>
      </div>
    </div>
  );
}