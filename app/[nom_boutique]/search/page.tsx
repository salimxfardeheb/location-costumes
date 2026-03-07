"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FiSearch, FiUser, FiPackage, FiX,
  FiEye, FiCalendar, FiHash, FiCheckCircle, FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";
import { LocationItem } from "@/app/functions";
import { searchClientLocations } from "@/app/firebase/getLocations";

const SearchPage = () => {
  const { nom_boutique } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<LocationItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalLocations = results.length;
  const clientName = results[0]?.client?.name ?? "";
  const clientPhone = results[0]?.client?.phone ?? "";

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setHasSearched(true);
      setLoading(true);
      try {
        const data = await searchClientLocations(searchQuery);
        setResults(data);
      } catch (err) {
        console.error("Erreur recherche :", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getTotalItems = (location: LocationItem) =>
    (location.costumes?.length ?? 0) +
    (location.chemise ? 1 : 0) +
    (location.chaussure ? 1 : 0) +
    (location.accessories?.length ?? 0);

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return "";
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 p-3 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── SEARCH BAR ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#000c79] p-2.5 rounded-xl shadow-md shadow-blue-900/20">
              <FiSearch className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Recherche client</h1>
              <p className="text-gray-400 text-xs">Retrouver toutes les locations</p>
            </div>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-base" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom ou téléphone..."
              className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#000c79] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-base" />
              </button>
            )}
          </div>
        </div>

        {/* ── CLIENT CARD ── */}
        {hasSearched && results.length > 0 && (
          <div className="relative bg-[#000c79] rounded-2xl p-5 overflow-hidden shadow-lg shadow-blue-900/20">
            {/* decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between flex-wrap gap-4">
              {/* Client info */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <FiUser className="text-white text-lg" />
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-tight">{clientName}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{clientPhone}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-center border border-white/10">
                  <p className="text-white font-bold text-2xl leading-none">{totalLocations}</p>
                  <p className="text-blue-300 text-xs mt-1">location{totalLocations > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Historique des locations</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#000c79] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && results.length === 0 && hasSearched && (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiSearch className="text-gray-400 text-xl" />
              </div>
              <p className="text-gray-400 text-sm">Aucun résultat trouvé</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-sm">Lancez une recherche pour voir les locations</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2.5">
              {results.map((location, index) => {
                const rest = Number(location.client?.rest ?? 0);
                const isPaid = rest === 0;

                return (
                  <div
                    key={location.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Index */}
                      <span className="bg-blue-50 text-[#000c79] text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg shrink-0">
                        {index + 1}
                      </span>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <FiCalendar className="shrink-0" />
                        <span>{formatDate(location.location_date)}</span>
                      </div>

                      {/* Articles */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <FiPackage className="shrink-0" />
                        <span>{getTotalItems(location)} article{getTotalItems(location) > 1 ? "s" : ""}</span>
                      </div>

                      {/* Statut paiement */}
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isPaid
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-500"
                      }`}>
                        {isPaid ? (
                          <><FiCheckCircle className="text-xs" /> Soldé</>
                        ) : (
                          <><FiAlertCircle className="text-xs" /> {rest.toLocaleString("fr-FR")} DA</>
                        )}
                      </span>
                    </div>

                    <Link
                      href={`/${nom_boutique}/dashboard/${location.id}`}
                      className="bg-[#000c79] hover:bg-[#000a35] text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ml-2"
                    >
                      <FiEye />
                      <span className="hidden sm:inline">Voir</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;