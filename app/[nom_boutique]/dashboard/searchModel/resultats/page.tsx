"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultatsPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const category = searchParams.get("category");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date || !category) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/resultats?date=${date}&category=${category}`);
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
  console.log(results)

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Résultats</h1>
      <p className="text-gray-600 mb-6">
        Date : <span className="font-semibold">{date}</span> | Catégorie :{" "}
        <span className="font-semibold">{category}</span>
      </p>

      {loading && <p className="text-blue-500">Chargement...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">Aucun résultat trouvé.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="font-semibold text-lg">{item.model}</h2>
            {item.image_path && (
              <img
                src={item.image_path}
                alt={item.image_path}
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
