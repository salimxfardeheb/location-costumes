"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const { nom_boutique } = useParams();
  const [date_location, setDateLocation] = useState("");
  const [category, setCategory] = useState("costume");
    const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams({
      date: date_location,
      category: category,
    });

    router.push(`/${nom_boutique}/dashboard/searchModel/resultats?${query.toString()}`);
  };
  return (
    <div className="flex justify-center items-center p-10 ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full max-w-lg bg-white p-10 rounded-2xl shadow-lg">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-lg font-medium text-gray-700">
            Sélectionner la date de location :
          </span>
          <input
            type="date"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] focus:ring-2 focus:ring-[#36CBC1] focus:outline-none transition-all"
            value={date_location}
            onChange={(e) => setDateLocation(e.target.value)}
            required
          />
        </label>

        <label htmlFor="category" className="flex flex-col gap-2 w-full">
          <span className="text-lg font-medium text-gray-700">
            Sélectionner catégorie :
          </span>
          <div>
            <select
              name="category"
              id="category"
              className="w-full p-3 border-2 bg-[#B6FFF6] border-[#36CBC1] rounded-xl focus:outline-none transition-all cursor-pointer"
              value={category}
               onChange={(e) => setCategory(e.target.value)}
            >
              <option value="costume" className="optCategory">
                Costume
              </option>
              <option value="chemise" className="optCategory">
                Chemise
              </option>
              <option value="chaussure" className="optCategory">
                Chaussure
              </option>
              <option value="accessoire" className="optCategory">
                Accessoire
              </option>
            </select>
          </div>
        </label>

        <button
          type="submit"
          className="bg-gray-300 text-white font-semibold px-8 py-3 rounded-xl" disabled
        >
          Rechercher
        </button>
      </form>
    </div>
  );
};
 // class recherch : bg-[#F39C12] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:opacity-90 hover:scale-102 transition-transform

export default Page;
