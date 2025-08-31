"use client";
import React, { useState } from "react";
import { createLocation } from "@/app/actions/prisma/createLocation";

const Page = () => {
  const [locationDate, setLocationDate] = useState("");
  const [costume, setCostume] = useState("");
  const [sizeBlazer, setSizeBlazer] = useState("");
  const [sizePant, setSizePant] = useState("");
  const [shirt, setShirt] = useState("");
  const [sizeShirt, setSizeShirt] = useState("");
  const [shoe, setShoe] = useState("");
  const [sizeShoe, setSizeShoe] = useState("");
  const [accessories, setAccessories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accessory = [
    "Cravate",
    "Papillion",
    "Ceinture",
    "Bouttons manchettes",
    "Montre",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createLocation(
        new Date(locationDate),
        costume,
        sizeBlazer,
        sizePant,
        shirt,
        sizeShirt,
        shoe,
        sizeShoe,
        accessories,
      );

      setSuccess("✅ Location ajoutée avec succès !");
      setLocationDate("");
      setCostume("");
      setSizeBlazer("");
      setSizePant("");
      setShirt("");
      setSizeShirt("");
      setShoe("");
      setSizeShoe("");
      setAccessories([]);
    } catch (err) {
      setError("❌ Une erreur est survenue lors de l’ajout de la location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col justify-center items-center max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between gap-10 p-6"
      >
        {/* Date */}
        <label className="flex justify-start items-center gap-4">
          <span className="text-xl">Sélectionner la date :</span>
          <input
            type="date"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] 
              placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            value={locationDate}
            onChange={(e) => setLocationDate(e.target.value)}
          />
        </label>

        {/* Costume + tailles */}
        <div className="flex gap-10 w-full">
          <label className="flex gap-4 justify-start items-center">
            <span className="text-xl">Model : </span>
            <input
              type="text"
              placeholder="N° Model"
              value={costume}
              onChange={(e) => setCostume(e.target.value)}
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] 
                placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">Blazer : </span>
            <input
              type="text"
              placeholder="Taille"
              value={sizeBlazer}
              onChange={(e) => setSizeBlazer(e.target.value)}
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">Pants : </span>
            <input
              type="text"
              placeholder="Taille"
              value={sizePant}
              onChange={(e) => setSizePant(e.target.value)}
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
        </div>

        {/* Chemise */}
        <div className="flex gap-10 w-full">
          <label className="flex gap-4 justify-start items-center">
            <span className="text-xl">Chemise : </span>
            <input
              type="text"
              placeholder="N° Model"
              value={shirt}
              onChange={(e) => setShirt(e.target.value)}
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">Taille : </span>
            <input
              type="text"
              placeholder="Taille"
              value={sizeShirt}
              onChange={(e) => setSizeShirt(e.target.value)}
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
        </div>

        {/* Chaussure */}
        <div className="flex gap-10 w-full">
          <label className="flex gap-4 justify-start items-center">
            <span className="text-xl">Chaussure : </span>
            <input
              type="text"
              placeholder="N° Model"
              value={shoe}
              onChange={(e) => setShoe(e.target.value)}
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">Pointure : </span>
            <input
              type="text"
              placeholder="Taille"
              value={sizeShoe}
              onChange={(e) => setSizeShoe(e.target.value)}
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            />
          </label>
        </div>

        {/* Accessoires */}
        <label className="flex flex-col justify-start items-start gap-4">
          <span className="text-xl">Accessoires :</span>
          <ul className="flex gap-20 text-xl">
            {accessory.map((accessoire) => (
              <li key={accessoire} className="flex gap-4">
                <input
                  type="checkbox"
                  value={accessoire}
                  checked={accessories.includes(accessoire)}
                  onChange={(e) =>
                    setAccessories((prev) =>
                      e.target.checked
                        ? [...prev, accessoire]
                        : prev.filter((s) => s !== accessoire)
                    )
                  }
                  className="w-4 rounded-full"
                />
                {accessoire}
              </li>
            ))}
          </ul>
        </label>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F39C12] text-white px-8 py-2 rounded-lg hover:opacity-85 cursor-pointer mx-auto"
        >
          {loading ? "Ajout en cours..." : "Ajouter la location"}
        </button>

        {/* Messages */}
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Page;
