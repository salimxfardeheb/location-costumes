"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultatsPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const category = searchParams.get("category");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    const { nom_boutique } = useParams();

  useEffect(() => {
    if (!date || !category) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/resultats?date=${date}&category=${category}`
        );
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        } else {
          console.error("Erreur:", data.error);
        }
      } catch (err) {
        console.error("Erreur fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [date, category]);
  console.log(results);

  return (
    <div className="flex flex-col justify-center items-center gap-9 mt-16">
      <div className="flex flex-col items-center w-full bg-white rounded-2xl shadow-md">
        <h1 className="w-full px-10 py-4 text-4xl rounded-t-2xl  font-bold mb-4 bg-gradient-to-r from-[#06B9AE] to-[#0A7871] text-white">Résultats</h1>
        <p className="w-full px-10 text-gray-600 mb-6 text-lg">
          Date : <span className="font-semibold">{date}</span> | Catégorie :{" "}
          <span className="font-semibold">{category}</span>
        </p>
      </div>

      {loading && <p className="text-blue-500">Chargement...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">Aucun résultat trouvé.</p>
      )}

      <div className="px-[3.5%] flex flex-wrap gap-32 w-full">
        {results.map((item, i) => (
          <div
            key={i}
            className="flex flex-col justify-center items-center w-fit"
          >
              {item.image_path && (
                <img
                  src={item.image_path}
                  alt={item.image_path}
                  className="max-w-56 h-64 object-cover rounded-xl shadow"
                />
              )}
              <p className="text-xl font-mono mt-2">
                modèle: <span>{item.model}</span>
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}
