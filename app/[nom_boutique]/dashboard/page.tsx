"use server";

import { get_locations } from "@/app/firebase/getLocations";
import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { all?: string };
}) {
  const rows = [
    "Date Sortie",
    "Costume",
    "Chemise",
    "Chaussure",
    "Accessoires",
  ];
  const showAll = searchParams.all === 'true'; 

  const result = await get_locations(showAll);
  const sortLocationsByDate = result.sort(
    (a, b) => a.date_sortie.getTime() - b.date_sortie.getTime()
  );

  return (
    <div className="w-full">
      <div className="mt-11 mx-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center px-8 py-5 rounded-t-2xl">
          <p className="text-2xl font-semibold">{showAll ? "Tous les locations" : "Locations à venir"}</p>
      
        <Link
          href={`/1/dashboard?all=${!showAll}`}
          className="text-sm font-medium text-[#06B9AE] px-2 py-1 rounded-lg hover:outline-1 hover:text-[#06B9AE] transition"
        >   
          {showAll ? "Voir uniquement à venir" : "Voir tout"}
        </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#06B9AE] to-[#0A7871] text-white">
                {rows.map((col, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 font-semibold uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {sortLocationsByDate.map((data, i) => (
                <tr
                  key={i}
                  className="text-center h-16 font-medium text-gray-800 hover:bg-[#E6FFFA] transition"
                >
                  <td className="px-6 py-4">
                    {data.date_sortie instanceof Date
                      ? data.date_sortie.toLocaleDateString()
                      : data.date_sortie}
                  </td>
                  <td className="px-6 py-4">
                    {data.costumes.map((model, i) => (
                      <span
                        key={i}
                        className="px-2 border rounded-4xl mx-2 bg-gray-300 text-gray-600"
                      >
                        {model.model}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">{data.chemise?.model}</td>
                  <td className="px-6 py-4">{data.chaussure?.model}</td>
                  <td className="px-6 py-4">
                    {data.accessories.map((model, i) => (
                      <span key={i}>{model.model},</span>
                    ))}
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    <Link href={`dashboard/${data.id}`}>
                      <IoInformationCircleOutline className="text-2xl text-[#06B9AE] hover:text-[#0A7871] transition" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
