'use client'
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import { HiSearch } from "react-icons/hi";

const NavBar = () => {
  
  const now: Date = new Date();
  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const { nom_boutique } = useParams();
  const shop_name_upperCase = nom_boutique?.toString().toUpperCase();
  
  return (
    <header className="">
      <div className="flex justify-between items-center px-6 py-4 gap-6">
        {/* Date Section */}
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-gray-800 capitalize">
            {formattedDate}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Tableau de bord
          </p>
        </div>

        {/* Shop Name Badge */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] text-white px-6 py-3 rounded-2xl shadow-lg">
            <p className="text-xl font-bold tracking-wide">
              {shop_name_upperCase}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href={`/${nom_boutique}/addLocation`} 
            className="bg-gradient-to-r from-yellow-500 to-orange-600  text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-[#E67E22] hover:to-[#D35400] active:scale-95 transition-all duration-200 flex items-center gap-2 group"
          >
            <IoMdAddCircle className="text-xl group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm">Ajouter une location</span>
          </Link>
          
          <Link 
            href={`/${nom_boutique}/dashboard/searchModel`} 
            className="bg-white text-[#000c79] border-2 border-[#000c79] font-semibold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#000c79] hover:text-white active:scale-95 transition-all duration-200 flex items-center gap-2 group"
          >
            <HiSearch className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm">Rechercher</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;