"use client";
import {
  ItemCloth,
  LocationInput,
} from "@/app/actions/firebase/createLocation";
import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

const Page = () => {
  const [locationDate, setLocationDate] = useState("");
  const [costumes, setCostumes] = useState<ItemCloth[]>([
    { model: "", blazer: "", pant: "" },
  ]);
  const [shirt, setShirt] = useState<ItemCloth>({ model: "", size: "" });
  const [shoe, setShoe] = useState<ItemCloth>({ model: "", size: "" });
  const [accessories, setAccessories] = useState<string[]>([]); // ✅ string[]

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accessory = [
    "Cravate",
    "Papillon",
    "Ceinture",
    "Boutons manchettes",
    "Montre",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newLocation: LocationInput = {
        location_date: locationDate,
        costume: costumes,
        shirt,
        shoe,
        accessory: accessories.map((a) => ({ model: a })),
      };

      const res = await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erreur API");

      setSuccess("✅ Location ajoutée avec succès !");
      setLocationDate("");
      setCostumes([{ model: "", blazer: "", pant: "" }]);
      setShirt({ model: "", size: "" });
      setShoe({ model: "", size: "" });
      setAccessories([]);
    } catch (err) {
      setError("❌ Une erreur est survenue lors de l’ajout de la location");
    } finally {
      setLoading(false);
    }
  };

  const handleCostumeChange = (
    index: number,
    field: keyof ItemCloth,
    value: string
  ) => {
    const newCostumes = [...costumes];
    newCostumes[index] = { ...newCostumes[index], [field]: value };
    setCostumes(newCostumes);
  };

  const addCostume = () => {
    setCostumes([...costumes, { model: "", blazer: "", pant: "" }]);
  };

  const removeCostume = (index: number) => {
    const newCostumes = costumes.filter((_, i) => i !== index);
    setCostumes(newCostumes);
  };

  return (
    <div className="mt-10 flex flex-col justify-center items-center w-fit mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between items-center gap-10 p-6"
      >
        {/* Date */}
        <label className="flex justify-start items-center gap-4">
          <span className="text-xl">Sélectionner la date :</span>
          <input
            type="date"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            value={locationDate}
            onChange={(e) => setLocationDate(e.target.value)}
            required
          />
        </label>

        {/* Costumes dynamiques */}
        <div className="flex w-full">
          <div className="flex flex-col gap-6 min-w-fit">
            <span className="text-xl font-semibold">Costumes :</span>
            {costumes.map((c, index) => (
              <div key={index} className="flex gap-6 items-center">
                <label className="flex gap-2 items-center">
                  <span>Model :</span>
                  <input
                    type="text"
                    placeholder="N° Model"
                    value={c.model}
                    onChange={(e) =>
                      handleCostumeChange(index, "model", e.target.value)
                    }
                    className="bg-[#B6FFF6] px-4 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>
                <label className="flex gap-2 items-center">
                  <span>Blazer :</span>
                  <input
                    type="text"
                    placeholder="Taille"
                    value={c.blazer}
                    onChange={(e) =>
                      handleCostumeChange(index, "blazer", e.target.value)
                    }
                    className="w-24 bg-[#B6FFF6] px-4 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>
                <label className="flex gap-2 items-center">
                  <span>Pants :</span>
                  <input
                    type="text"
                    placeholder="Taille"
                    value={c.pant}
                    onChange={(e) =>
                      handleCostumeChange(index, "pant", e.target.value)
                    }
                    className="w-24 bg-[#B6FFF6] px-4 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>
                {costumes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCostume(index)}
                    className="text-red-500 hover:opacity-85"
                  >
                    <MdOutlineCancel className="text-3xl" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={addCostume}
              className="self-start bg-[#36CBC1] text-white px-4 py-2 rounded-lg hover:opacity-85"
            >
              Ajouter un autre modèle
            </button>
          </div>
        </div>

        {/* Chemise */}
        <div className="flex flex-col gap-10 w-full">
          <span className="text-xl font-semibold">Chemise :</span>
          <div className="flex gap-7">
            <label className="flex gap-4 justify-start items-center">
              <span>Model :</span>
              <input
                type="text"
                placeholder="N° Model"
                value={shirt.model}
                onChange={(e) => setShirt({ ...shirt, model: e.target.value })}
                className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
            <label className="flex justify-start items-center gap-4">
              <span>Taille :</span>
              <input
                type="text"
                placeholder="Taille"
                value={shirt.size}
                onChange={(e) => setShirt({ ...shirt, size: e.target.value })}
                className="w-24 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
          </div>
        </div>

        {/* Chaussure */}
        <div className="flex flex-col gap-10 w-full">
          <span className="text-xl font-semibold">Chaussure :</span>
          <div className="flex items-center gap-7">
            <label className="flex gap-4 justify-start items-center">
              <span>Model :</span>
              <input
                type="text"
                placeholder="N° Model"
                value={shoe.model}
                onChange={(e) => setShoe({ ...shoe, model: e.target.value })}
                className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
            <label className="flex justify-start items-center gap-4">
              <span>Pointure :</span>
              <input
                type="text"
                placeholder="Taille"
                value={shoe.size}
                onChange={(e) => setShoe({ ...shoe, size: e.target.value })}
                className="w-24 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
          </div>
        </div>

        {/* Accessoires */}
        <div>
          <label className="flex flex-col justify-start items-start gap-4">
            <span className="text-xl font-semibold">Accessoires :</span>
            <ul className="flex gap-20 text-xl">
              {accessory.map((acc) => (
                <li key={acc} className="flex gap-4">
                  <input
                    type="checkbox"
                    value={acc}
                    checked={accessories.includes(acc)}
                    onChange={(e) =>
                      setAccessories((prev) =>
                        e.target.checked
                          ? [...prev, acc]
                          : prev.filter((s) => s !== acc)
                      )
                    }
                    className="w-4 rounded-full"
                  />
                  {acc}
                </li>
              ))}
            </ul>
          </label>
        </div>

        {/* Bouton submit */}
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
