"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiEdit,
} from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { TbHanger } from "react-icons/tb";
import { RiShirtLine } from "react-icons/ri";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { IoIosBowtie } from "react-icons/io";

import {
  Location,
  Costume,
  Chemise,
  Chaussure,
  Accessoire,
  Client,
  categories,
} from "@/app/functions";
import { get_all_category_cloth } from "@/app/firebase/getCategoryCloth";

interface AvailableModels {
  costumes: { model: string }[];
  chemises: { model: string }[];
  chaussures: { model: string }[];
  accessoires: { model: string }[];
}

interface LocationProps {
  initialData: Location;
  locationId: string;
  nomBoutique: string;
}

const EditLocationForm: React.FC<LocationProps> = ({
  initialData,
  locationId,
  nomBoutique,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDate, setEditDate] = useState(false);

  const [availableModels, setAvailableModels] = useState<AvailableModels>({
    costumes: [],
    chemises: [],
    chaussures: [],
    accessoires: [],
  });

  // ─── Data states ────────────────────────────────────────────────────────────
  const [clientData, setClientData] = useState<Client>({
    name: initialData.client?.name || "",
    phone: initialData.client?.phone || "",
    vers: initialData.client?.vers || 0,
    rest: initialData.client?.rest || 0,
    comment: initialData.client?.comment || "",
  });

  const [prixTotal, setPrixTotal] = useState<number>(initialData.total || 0);

  const [location_date, setDateSortie] = useState<string>(
    initialData.location_date instanceof Date
      ? initialData.location_date.toISOString().split("T")[0]
      : initialData.location_date || "",
  );

  const [costumes, setCostumes] = useState<Costume[]>(
    initialData.costumes?.length
      ? initialData.costumes
      : [{ ref: "", model: "", blazer: "", pant: "" }],
  );

  const [chemise, setChemise] = useState<Chemise | null>(
    initialData.chemise || null,
  );

  const [chaussure, setChaussure] = useState<Chaussure | null>(
    initialData.chaussure || null,
  );

  const [accessories, setAccessories] = useState<Accessoire[]>(
    initialData.accessories || [],
  );

  // ─── Fetch available models ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const [costumesData, chemisesData, chaussuresData, accessoiresData] =
          await Promise.all([
            get_all_category_cloth(categories[0]),
            get_all_category_cloth(categories[1]),
            get_all_category_cloth(categories[2]),
            get_all_category_cloth(categories[3]),
          ]);

        const sortByModel = (a: { model: string }, b: { model: string }) =>
          a.model.toLowerCase().localeCompare(b.model.toLowerCase());

        setAvailableModels({
          costumes: costumesData.sort(sortByModel),
          chemises: chemisesData.sort(sortByModel),
          chaussures: chaussuresData.sort(sortByModel),
          accessoires: [
            ...new Map(accessoiresData.map((a) => [a.model, a])).values(),
          ].sort(sortByModel),
        });
      } catch (err) {
        console.error("Erreur lors du chargement des modèles:", err);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: name === "vers" || name === "rest" ? Number(value) : value,
    }));
  };

  // Costumes
  const handleCostumeChange = (
    index: number,
    field: keyof Costume,
    value: string,
  ) => {
    const updated = [...costumes];
    updated[index] = { ...updated[index], [field]: value };
    setCostumes(updated);
  };

  const addCostume = () => {
    setCostumes([...costumes, { ref: "", model: "", blazer: "", pant: "" }]);
  };

  const removeCostume = (index: number) => {
    setCostumes((prev) => prev.filter((_, i) => i !== index));
  };

  // Chemise
  const addChemise = () => setChemise({ ref: null, model: "", size: "" });
  const removeChemise = () => setChemise(null);
  const handleChemiseChange = (field: keyof Chemise, value: string) => {
    setChemise((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Chaussure
  const addChaussure = () => setChaussure({ ref: null, model: "", size: "" });
  const removeChaussure = () => setChaussure(null);
  const handleChaussureChange = (field: keyof Chaussure, value: string) => {
    setChaussure((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Accessories
  const toggleAccessory = (model: string, checked: boolean) => {
    setAccessories((prev) =>
      checked
        ? [...prev, { ref: null, model: "", description: "" }]
        : prev.filter((a) => a.model !== model),
    );
  };

  const removeAccessory = (model: string) => {
    setAccessories((prev) => prev.filter((a) => a.model !== model));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedRest =
        clientData.vers < prixTotal ? prixTotal - clientData.vers : 0;

      const payload = {
        locationId,
        location_date: new Date(location_date),
        costume: costumes,
        chemise,
        chaussure,
        accessoire: accessories,
        client: { ...clientData, rest: updatedRest },
        total: prixTotal,
      };

      const res = await fetch(`/api/editLocation`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur API");

      setShowSuccessMessage(true);
      setTimeout(() => {
        router.push(`/${nomBoutique}/dashboard/${locationId}`);
      }, 1500);
    } catch (err: any) {
      setError(
        err.message || "❌ Une erreur est survenue lors de la modification",
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const selectClass =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  const inputClass =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link
            href={`/${nomBoutique}/dashboard/${locationId}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95 border border-gray-200"
          >
            <FiArrowLeft className="text-lg" />
            <span className="font-semibold">Retour</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Modifier la location
          </h1>
        </div>

        {/* Success */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-fadeIn">
            ✓ Modifications enregistrées avec succès !
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl animate-fadeIn flex items-center gap-2">
            <FiX />
            {error}
          </div>
        )}

        {/* Loading models banner */}
        {loadingModels && (
          <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl text-sm flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Chargement des modèles disponibles...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Informations Client ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <FiUser className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Informations Client
              </h2>
            </div>

            {/* Date de sortie */}
            <div className="py-6 border-b border-gray-100 mb-6">
              {!editDate ? (
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <FiCalendar className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Date de sortie
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {(() => {
                          const d = initialData?.location_date;
                          if (!d) return "—";
                          // Firestore Timestamp { seconds, nanoseconds }
                          if (typeof d === "object" && "seconds" in d) {
                            return new Date(
                              (d as any).seconds * 1000,
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                          }
                          // Date native
                          if (d instanceof Date) {
                            return d.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                          }
                          // String ISO ("2026-03-03T00:00:00.000Z")
                          return new Date(d).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });
                        })()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditDate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-medium"
                  >
                    <FiEdit className="text-lg" />
                    Modifier
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FiCalendar className="text-blue-600" />
                      Nouvelle date
                    </label>
                    <input
                      type="date"
                      value={location_date}
                      onChange={(e) => setDateSortie(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditDate(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all font-medium active:scale-95"
                  >
                    <FiX className="text-lg" />
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Nom du client
                </label>
                <input
                  type="text"
                  name="name"
                  value={clientData.name}
                  onChange={handleClientChange}
                  className={inputClass}
                  placeholder="Entrez le nom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiPhone className="inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={clientData.phone}
                  onChange={handleClientChange}
                  className={inputClass}
                  placeholder="0555 00 00 00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Prix total (DA)
                </label>
                <input
                  type="number"
                  value={prixTotal}
                  onChange={(e) =>
                    setPrixTotal(parseFloat(e.target.value) || 0)
                  }
                  className={inputClass}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Versement (DA)
                </label>
                <input
                  type="number"
                  name="vers"
                  value={clientData.vers}
                  onChange={handleClientChange}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Reste à payer (DA)
                </label>
                <input
                  type="number"
                  readOnly
                  value={
                    clientData.vers < prixTotal
                      ? prixTotal - clientData.vers
                      : 0
                  }
                  className={`${inputClass} bg-orange-50 border-orange-200 text-orange-700 font-semibold cursor-not-allowed`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiFileText className="inline mr-2" />
                  Commentaire
                </label>
                <textarea
                  name="comment"
                  value={clientData.comment}
                  onChange={handleClientChange}
                  className={inputClass}
                  placeholder="Notes ou commentaires..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ── Costumes ────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/10 p-3 rounded-xl">
                  <TbHanger className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Costumes</h2>
              </div>
              <button
                type="button"
                onClick={addCostume}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <FiPlus className="text-lg" />
                Ajouter
              </button>
            </div>

            {costumes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun costume ajouté
              </p>
            ) : (
              <div className="space-y-4">
                {costumes.map((costume, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-end p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-4 w-full">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Modèle
                        </label>
                        <select
                          value={costume.model}
                          onChange={(e) =>
                            handleCostumeChange(index, "model", e.target.value)
                          }
                          className={selectClass}
                          disabled={loadingModels}
                        >
                          <option value="">Sélectionner un modèle</option>
                          {availableModels.costumes.map((m) => (
                            <option key={m.model} value={m.model}>
                              {m.model}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Taille Blazer
                        </label>
                        <input
                          type="text"
                          value={costume.blazer}
                          onChange={(e) =>
                            handleCostumeChange(index, "blazer", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Ex: 48"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Taille Pantalon
                        </label>
                        <input
                          type="text"
                          value={costume.pant}
                          onChange={(e) =>
                            handleCostumeChange(index, "pant", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Ex: 44"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCostume(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2 flex-shrink-0"
                      title="Supprimer ce costume"
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Chemise ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600/10 p-3 rounded-xl">
                  <RiShirtLine className="text-purple-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Chemise</h2>
              </div>
              {!chemise ? (
                <button
                  type="button"
                  onClick={addChemise}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiPlus className="text-lg" />
                  Ajouter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={removeChemise}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiTrash2 className="text-lg" />
                  Supprimer
                </button>
              )}
            </div>

            {chemise ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    value={chemise.model}
                    onChange={(e) =>
                      handleChemiseChange("model", e.target.value)
                    }
                    className={selectClass}
                    disabled={loadingModels}
                  >
                    <option value="">Sélectionner un modèle</option>
                    {availableModels.chemises.map((m) => (
                      <option key={m.model} value={m.model}>
                        {m.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taille
                  </label>
                  <input
                    type="text"
                    value={chemise.size}
                    onChange={(e) =>
                      handleChemiseChange("size", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Ex: S, M, L, XL"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune chemise ajoutée
              </p>
            )}
          </div>

          {/* ── Chaussures ───────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-amber-600/10 p-3 rounded-xl">
                  <LiaShoePrintsSolid className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Chaussures</h2>
              </div>
              {!chaussure ? (
                <button
                  type="button"
                  onClick={addChaussure}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiPlus className="text-lg" />
                  Ajouter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={removeChaussure}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiTrash2 className="text-lg" />
                  Supprimer
                </button>
              )}
            </div>

            {chaussure ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    value={chaussure.model}
                    onChange={(e) =>
                      handleChaussureChange("model", e.target.value)
                    }
                    className={selectClass}
                    disabled={loadingModels}
                  >
                    <option value="">Sélectionner un modèle</option>
                    {availableModels.chaussures.map((m) => (
                      <option key={m.model} value={m.model}>
                        {m.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pointure
                  </label>
                  <input
                    type="text"
                    value={chaussure.size}
                    onChange={(e) =>
                      handleChaussureChange("size", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Ex: 40, 41, 42"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune chaussure ajoutée
              </p>
            )}
          </div>

          {/* ── Accessoires ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <IoIosBowtie className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Accessoires</h2>
            </div>

            {loadingModels ? (
              <p className="text-sm text-blue-600 flex items-center gap-2 py-4">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Chargement des accessoires...
              </p>
            ) : availableModels.accessoires.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">
                Aucun accessoire disponible
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableModels.accessoires.map((acc) => {
                  const isChecked = accessories.some(
                    (a) => a.model === acc.model,
                  );
                  return (
                    <label
                      key={acc.model}
                      className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? "border-blue-500 bg-blue-50"
                          : "border-blue-200/50 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          toggleAccessory(acc.model, e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 border-blue-400 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {acc.model}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Show currently selected accessories (from initialData that may not be in available list) */}
            {accessories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Accessoires sélectionnés :
                </p>
                <div className="flex flex-wrap gap-2">
                  {accessories.map((acc) => (
                    <span
                      key={acc.model}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {acc.model}
                      <button
                        type="button"
                        onClick={() => removeAccessory(acc.model)}
                        className="hover:text-blue-900 transition-colors"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Boutons d'action ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pb-8">
            <Link
              href={`/${nomBoutique}/dashboard/${locationId}`}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <FiSave className="text-lg" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLocationForm;
