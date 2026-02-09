"use client";
import { ItemCloth, LocationInput } from "@/app/firebase/createLocation";
import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { checkAvailability } from "@/app/firebase/checkAvailability";

const Page = () => {
  const [locationDate, setLocationDate] = useState("");
  const [costumes, setCostumes] = useState<ItemCloth[]>([
    { model: "", blazer: "", pant: "" },
  ]);
  const [chemise, setChemise] = useState<ItemCloth>({ model: "", size: "" });
  const [chaussure, setChaussure] = useState<ItemCloth>({
    model: "",
    size: "",
  });
  const [accessories, setAccessories] = useState<string[]>([]);

  const [verificationMessages, setVerificationMessages] = useState<string[]>(
    [],
  );

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
  const rentDate = new Date(locationDate);

  // --- Vérification disponibilité avant ajout
  const verifyCostume = async (c: ItemCloth, index: number) => {
    try {
      const result = await checkAvailability(
        c.model ?? "",
        c.blazer ?? "",
        c.pant ?? "",
        rentDate,
      );

      const newMessages = [...verificationMessages];
      if (!result.ok) {
        newMessages[index] =
          result.message ?? "❌ Erreur lors de la vérification";
      } else {
        newMessages[index] = "✅ Costume disponible !";
      }
      setVerificationMessages(newMessages);

      return result.ok;
    } catch (err: any) {
      const newMessages = [...verificationMessages];
      newMessages[index] = "❌ Erreur lors de la vérification du costume";
      setVerificationMessages(newMessages);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      for (let i = 0; i < costumes.length; i++) {
        const ok = await verifyCostume(costumes[i], i);
        if (!ok) {
          setLoading(false);
          return;
        }
      }

      const newLocation: LocationInput = {
        location_date: rentDate,
        costume: costumes,
        chemise,
        chaussure,
        accessoire: accessories.map((a) => ({ model: a })),
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
      setChemise({ model: "", size: "" });
      setChaussure({ model: "", size: "" });
      setAccessories([]);
      setVerificationMessages([]);
    } catch (err: any) {
      setError(
        err.message ||
          "❌ Une erreur est survenue lors de l’ajout de la location",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCostumeChange = (
    index: number,
    field: keyof ItemCloth,
    value: string,
  ) => {
    const newCostumes = [...costumes];
    newCostumes[index] = { ...newCostumes[index], [field]: value };
    setCostumes(newCostumes);
  };

  const addCostume = () => {
    setCostumes([...costumes, { model: "", blazer: "", pant: "" }]);
    setVerificationMessages([...verificationMessages, ""]);
  };

  const removeCostume = (index: number) => {
    setCostumes(costumes.filter((_, i) => i !== index));
    setVerificationMessages(verificationMessages.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-10 flex flex-col justify-center items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-12 p-8 bg-white shadow-lg rounded-2xl w-[900px] max-w-full"
      >
        {/* Date */}
        <label className="flex flex-col gap-2">
          <span className="text-xl font-semibold">Sélectionner la date :</span>
          <input
            type="date"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1]"
            value={locationDate}
            onChange={(e) => setLocationDate(e.target.value)}
            required
          />
        </label>

        {/* Costumes dynamiques */}
        <div className="flex flex-col gap-6">
          <span className="text-xl font-semibold">Costumes :</span>
          {costumes.map((c, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-4 border rounded-xl bg-gray-50"
            >
              <div className="grid grid-cols-4 gap-4 items-end">
                <label className="flex flex-col gap-1">
                  <span>Model :</span>
                  <input
                    type="text"
                    placeholder="N° Model"
                    value={c.model}
                    onChange={(e) =>
                      handleCostumeChange(index, "model", e.target.value)
                    }
                    className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>Blazer :</span>
                  <input
                    type="text"
                    placeholder="Taille"
                    value={c.blazer}
                    onChange={(e) =>
                      handleCostumeChange(index, "blazer", e.target.value)
                    }
                    className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>Pantalon :</span>
                  <input
                    type="text"
                    placeholder="Taille"
                    value={c.pant}
                    onChange={(e) =>
                      handleCostumeChange(index, "pant", e.target.value)
                    }
                    className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
                  />
                </label>

                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => verifyCostume(c, index)}
                    className="border-2 border-[#36CBC1] text-sm hover:bg-[#B6FFF6] cursor-pointer text-[#36CBC1] px-3 py-1 rounded-lg"
                  >
                    Vérifier
                  </button>
                  {costumes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCostume(index)}
                      className="text-red-500 hover:opacity-85"
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  )}
                </div>
              </div>
              {/* Message de vérification */}
              {verificationMessages[index] && (
                <p
                  className={`text-sm mt-1 ${
                    verificationMessages[index].startsWith("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {verificationMessages[index]}
                </p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCostume}
            className="self-start bg-[#36CBC1] text-white px-4 py-2 rounded-lg hover:opacity-85"
          >
            Ajouter un autre modèle
          </button>
        </div>

        {/* Chemise */}
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold">Chemise :</span>
          <div className="grid grid-cols-2 gap-6">
            <label className="flex flex-col gap-1">
              <span>Model :</span>
              <input
                type="text"
                placeholder="N° Model"
                value={chemise.model}
                onChange={(e) =>
                  setChemise({ ...chemise, model: e.target.value })
                }
                className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Taille :</span>
              <input
                type="text"
                placeholder="Taille"
                value={chemise.size}
                onChange={(e) =>
                  setChemise({ ...chemise, size: e.target.value })
                }
                className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
          </div>
        </div>

        {/* Chaussure */}
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold">Chaussure :</span>
          <div className="grid grid-cols-2 gap-6">
            <label className="flex flex-col gap-1">
              <span>Model :</span>
              <input
                type="text"
                placeholder="N° Model"
                value={chaussure.model}
                onChange={(e) =>
                  setChaussure({ ...chaussure, model: e.target.value })
                }
                className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Pointure :</span>
              <input
                type="text"
                placeholder="Taille"
                value={chaussure.size}
                onChange={(e) =>
                  setChaussure({ ...chaussure, size: e.target.value })
                }
                className="bg-[#B6FFF6] px-3 py-2 rounded-xl border-2 border-[#36CBC1]"
              />
            </label>
          </div>
        </div>

        {/* Accessoires */}
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold">Accessoires :</span>
          <ul className="flex gap-10 flex-wrap text-lg">
            {accessory.map((acc) => (
              <li key={acc} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={acc}
                  checked={accessories.includes(acc)}
                  onChange={(e) =>
                    setAccessories((prev) =>
                      e.target.checked
                        ? [...prev, acc]
                        : prev.filter((s) => s !== acc),
                    )
                  }
                  className="w-4 h-4"
                />
                {acc}
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F39C12] text-white px-8 py-2 rounded-lg hover:opacity-85 cursor-pointer mx-auto"
        >
          {loading ? "Ajout en cours..." : "Ajouter la location"}
        </button>

        {/* Messages globaux */}
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Page;
