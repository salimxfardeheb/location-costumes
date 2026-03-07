'use client'
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import { HiSearch } from "react-icons/hi";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-3">

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:flex items-center justify-between gap-4">

          {/* Left — Date */}
          <div className="flex flex-col min-w-0">
            <p className="text-xl font-bold text-gray-800 capitalize leading-tight truncate">
              {formattedDate}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#000c79] inline-block" />
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                Tableau de bord
              </p>
            </div>
          </div>

          {/* Center — Shop Badge */}
          <div className="flex-shrink-0">
            <div className="relative bg-[#000c79] text-white px-6 py-2.5 rounded-2xl shadow-md shadow-blue-900/20 overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px)" }}
              />
              <p className="relative text-base font-bold tracking-widest">{shop_name_upperCase}</p>
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href={`/${nom_boutique}/addLocation`}
              className="group relative bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
              <IoMdAddCircle className="text-lg group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span>Ajouter</span>
            </Link>

            <Link
              href={`/${nom_boutique}/search`}
              className="group relative border-2 border-[#000c79] text-[#000c79] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#000c79] hover:text-white active:scale-95 transition-all duration-200 flex items-center gap-2 overflow-hidden"
            >
              <HiSearch className="text-lg group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span>Rechercher</span>
            </Link>
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex md:hidden items-center justify-between gap-3">

          {/* Shop badge */}
          <div className="bg-[#000c79] text-white px-4 py-2 rounded-xl shadow-md shadow-blue-900/20">
            <p className="text-sm font-bold tracking-widest">{shop_name_upperCase}</p>
          </div>

          {/* Date — centered, compact */}
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-400 capitalize truncate">{formattedDate}</p>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            {menuOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
          </button>
        </div>

        {/* ── MOBILE DROPDOWN ── */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href={`/${nom_boutique}/addLocation`}
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <IoMdAddCircle className="text-lg shrink-0" />
              <span>Ajouter une location</span>
            </Link>

            <Link
              href={`/${nom_boutique}/search`}
              onClick={() => setMenuOpen(false)}
              className="border-2 border-[#000c79] text-[#000c79] text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all"
            >
              <HiSearch className="text-lg shrink-0" />
              <span>Rechercher un client</span>
            </Link>
          </div>
        )}

      </div>
    </header>
  );
};

export default NavBar;