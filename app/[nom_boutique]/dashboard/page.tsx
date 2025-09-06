"use client";

import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";

export default function Dashboard() {
  const rows = ["Date Sortie", "Costume", "Chemise", "Chaussure", "Accessoires"];

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
              <tr className="bg-gray-100 text-gray-700 text-left">
                {rows.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-semibold uppercase tracking-wide">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((_, i) => (
                <tr
                  key={i}
                  className="text-center h-16 font-medium text-gray-800 hover:bg-[#E6FFFA] transition"
                >
                  <td className="px-6 py-4">11/11/1111</td>
                  <td className="px-6 py-4">1, 2</td>
                  <td className="px-6 py-4">Simple</td>
                  <td className="px-6 py-4">Mu</td>
                  <td className="px-6 py-4">Ceinture, Cravate</td>
                  <td className="px-6 py-4 flex justify-center">
                    <Link href={""}>
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
