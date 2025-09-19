"use client";
import React, { useState } from "react";

const Page = () => {
  const [date_location, setDateLocation] = useState("");
  const [category, setCategory] = useState("select");
  return (
    <div className="flex justify-center items-center p-10 ">
      <form className="flex flex-col gap-10 w-full max-w-lg bg-white p-10 rounded-2xl shadow-lg">
        {/* Date */}
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

        {/* Category */}
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

        {/* Button */}
        <button
          type="submit"
          className="bg-[#F39C12] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:opacity-90 hover:scale-105 transition-transform"
        >
          Rechercher
        </button>
      </form>
    </div>
  );
};

export default Page;
