"use client";

import React, { useState } from "react";
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
  FiPackage,
  FiX,
  FiEdit,
} from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

import {
  Location,
  Costume,
  Chemise,
  Chaussure,
  Accessoire,
  Client,
} from "@/app/functions";

interface locationProps {
  initialData: Location;
  locationId: string;
  nomBoutique: string;
}

const EditLocationForm: React.FC<locationProps> = ({
  initialData,
  locationId,
  nomBoutique,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [editDate, setEditDate] = useState(false);

  // data
  const [clientData, setClientData] = useState<Client>({
    name: initialData.client?.name || "",
    phone: initialData.client?.phone || "",
    vers: initialData.client?.vers || 0,
    rest: initialData.client?.rest || 0,
    comment: initialData.client?.comment || "",
  });

  const [location_date, setDateSortie] = useState<string>(
    initialData.location_date instanceof Date
      ? initialData.location_date.toISOString().split("T")[0]
      : initialData.location_date || "",
  );

  const [costumes, setCostumes] = useState<Costume[]>(
    initialData.costumes || [{ ref: "", model: "", blazer: "", pant: "" }],
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

  // handlers
  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setClientData((prev) => ({
      ...prev,
      [name]: name === "vers" || name === "rest" ? Number(value) : value,
    }));
  };

  const handleCostumeChange = (
    index: number,
    field: keyof Costume,
    value: string,
  ) => {
    const updated = [...costumes];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setCostumes(updated);
  };

  const addCostume = () => {
    setCostumes([...costumes, { ref: "", model: "", blazer: "", pant: "" }]);
  };

  const removeCostume = (index: number) => {
    setCostumes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
    } catch (error) {
      console.error("Erreur modification :", error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Message de succès */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-fadeIn">
            ✓ Modifications enregistrées avec succès !
          </div>
        )}

        <form className="space-y-6">
          {/* Informations Client */}
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
            <div className="py-6">
              {!editDate ? (
                <div className="flex justify-between items-end ">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <FiCalendar className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Date de sortie
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {initialData?.location_date instanceof Date
                          ? initialData.location_date.toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : initialData?.location_date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditDate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-medium"
                  >
                    <FiEdit className="text-lg" />
                    Modifier
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex items-end gap-4">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FiCalendar className="text-blue-600" />
                      Nouvelle date
                    </label>
                    <input
                      type="date"
                      value={location_date}
                      onChange={(e) => setDateSortie(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3 my-5">
                    <button
                      onClick={() => setEditDate(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-gray-700 rounded-xl hover:bg-red-200 transition-all font-medium active:scale-95"
                    >
                      <FiX className="text-lg" />
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Entrez le nom"
                  required
                />
              </div>

              {/* Téléphone */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0555 00 00 00"
                  required
                />
              </div>
              {/* Versement */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Prix total
                </label>
                <input
                  type="number"
                  name="vers"
                  value={initialData.total}
                  onChange={handleClientChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Reste */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Reste à payer (DA)
                </label>
                <input
                  type="number"
                  name="rest"
                  value={clientData.rest}
                  onChange={handleClientChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              {/* Commentaire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiFileText className="inline mr-2" />
                  Commentaire
                </label>
                <textarea
                  name="comment"
                  value={clientData.comment}
                  onChange={handleClientChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Notes ou commentaires..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Costumes */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/10 p-3 rounded-xl">
                  <FiPackage className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Costumes</h2>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                onClick={addCostume}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-12 w-full">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Modèle
                        </label>
                        <input
                          type="text"
                          value={costume.model}
                          onChange={(e) =>
                            handleCostumeChange(index, "model", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: C001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Taille Blazer
                        </label>
                        <input
                          type="text"
                          value={costume.blazer}
                          onChange={(e) =>
                            handleCostumeChange(index, "model", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                            handleCostumeChange(index, "model", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 44"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 max-h-12 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Supprimer ce costume"
                      onClick={() => removeCostume(index)}
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chemise */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chemise</h2>
              {!chemise ? (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiPlus className="text-lg" />
                  Ajouter
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiTrash2 className="text-lg" />
                  Supprimer
                </button>
              )}
            </div>

            {chemise ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modèle
                  </label>
                  <input
                    type="text"
                    value={chemise.model}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: CH001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taille
                  </label>
                  <input
                    type="text"
                    value={chemise.size}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: M"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune chemise ajoutée
              </p>
            )}
          </div>

          {/* Chaussures */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chaussures</h2>
              {!chaussure ? (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiPlus className="text-lg" />
                  Ajouter
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiTrash2 className="text-lg" />
                  Supprimer
                </button>
              )}
            </div>

            {chaussure ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modèle
                  </label>
                  <input
                    type="text"
                    value={chaussure.model}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Ex: SH001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pointure
                  </label>
                  <input
                    type="text"
                    value={chaussure.size}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Ex: 42"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune chaussure ajoutée
              </p>
            )}
          </div>

          {/* Accessoires */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Accessoires</h2>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <FiPlus className="text-lg" />
                Ajouter
              </button>
            </div>

            {accessories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun accessoire ajouté
              </p>
            ) : (
              <div className="space-y-4">
                {accessories.map((accessory, index) => (
                  <div
                    key={index}
                    className="p-4 flex justify-between items-end bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-12 w-full">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Modèle
                        </label>
                        <input
                          type="text"
                          value={accessory.model}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: ACC001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={accessory.description}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Cravate bleue"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 max-h-12 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Supprimer ce costume"
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
