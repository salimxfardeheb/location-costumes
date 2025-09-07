"use server";

import { get_locations } from "@/app/actions/firebase/getLocations";
import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";

export default async function Dashboard() {
  const rows = [
    "Date Sortie",
    "Costume",
    "Chemise",
    "Chaussure",
    "Accessoires",
  ];

  const result = await get_locations(false);
  const sortLocationsByDate = result.sort(
    (a, b) => a.date_sortie.getTime() - b.date_sortie.getTime()
  );

  return (
    <div className="w-full">
      <div className="mt-11 mx-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center px-8 py-5 bg-gradient-to-r from-[#06B9AE] to-[#0A7871] text-white rounded-t-2xl">
          <p className="text-2xl font-semibold">Locations à venir</p>
          <Link
            href={""}
            className="text-sm font-medium bg-white text-[#06B9AE] px-4 py-2 rounded-lg hover:bg-[#06B9AE] hover:text-white transition"
          >
            Voir tout
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
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
                  <td className="px-6 py-4">{data.shirt?.model}</td>
                  <td className="px-6 py-4">{data.shoe?.model}</td>
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
