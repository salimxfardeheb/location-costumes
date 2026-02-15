"use client";
import {
  ItemCloth,
  LocationInput,
  ClientInfo,
} from "@/app/firebase/createLocation";
import React, { useState, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { TbHanger } from "react-icons/tb";
import { checkAvailability } from "@/app/firebase/checkAvailability";
import { get_all_category_cloth } from "@/app/firebase/getCategoryCloth";
import { categories } from "@/app/functions";
import { RiShirtLine } from "react-icons/ri";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { IoIosBowtie } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface AvailableModels {
  costumes: { model: string; image: string | null }[];
  chemises: { model: string; image: string | null }[];
  chaussures: { model: string; image: string | null }[];
  accessoires: { model: string; image: string | null }[];
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [client, setClient] = useState<ClientInfo>({
    name: "",
    phone: "",
    vers: 0,
    rest: 0,
    comment: "",
  });
  const [prixTotal, setPrix] = useState(0);

  const [availableModels, setAvailableModels] = useState<AvailableModels>({
    costumes: [],
    chemises: [],
    chaussures: [],
    accessoires: [],
  });

  const [verificationMessages, setVerificationMessages] = useState<string[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
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

  useEffect(() => {
    const fetchAllModels = async () => {
      if (!locationDate) return;

      setLoadingModels(true);
      try {
        const [costumesData, chemisesData, chaussuresData, accessoiresData] =
          await Promise.all([
            get_all_category_cloth(categories[0]),
            get_all_category_cloth(categories[1]),
            get_all_category_cloth(categories[2]),
            get_all_category_cloth(categories[3]),
          ]);

        setAvailableModels({
          costumes: costumesData.sort((a, b) =>
            a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
          ),
          chemises: chemisesData.sort((a, b) =>
            a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
          ),
          chaussures: chaussuresData.sort((a, b) =>
            a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
          ),
          accessoires: accessoiresData.sort((a, b) =>
            a.model.toLowerCase().localeCompare(b.model.toLowerCase()),
          ),
        });
      } catch (err) {
        console.error("Erreur lors du chargement des modèles:", err);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchAllModels();
  }, [locationDate]);

  const verifyCostume = async (c: ItemCloth, index: number) => {
    if (!locationDate) {
      const newMessages = [...verificationMessages];
      newMessages[index] = "⚠️ Veuillez sélectionner une date d'abord";
      setVerificationMessages(newMessages);
      return false;
    }

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

      if (client.vers < prixTotal) {
        client.rest = prixTotal - client.vers;
      } else client.rest = 0;

      const newLocation: LocationInput = {
        location_date: rentDate,
        costume: costumes,
        chemise,
        chaussure,
        accessoire: accessories.map((a) => ({ model: a })),
        client: client,
      };

      const res = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLocation),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur API");

      setSuccess("Location ajoutée avec succès !");
      setLocationDate("");
      setCostumes([{ model: "", blazer: "", pant: "" }]);
      setChemise({ model: "", size: "" });
      setChaussure({ model: "", size: "" });
      setAccessories([]);
      setVerificationMessages([]);
      setCurrentStep(1);
    } catch (err: any) {
      setError(
        err.message ||
          "❌ Une erreur est survenue lors de l'ajout de la location",
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = () => {
    return locationDate !== "";
  };

  const canProceedToStep3 = () => {
    return costumes.some((c) => c.model !== "");
  };

  const steps = [
    { number: 1, title: "Date de location" },
    { number: 2, title: "Informations de location" },
    { number: 3, title: "Informations client" },
  ];

  return (
    <div className="min-h-screen w-full py-12 px-4">
      <div className="mx-auto max-w-full">
        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      currentStep >= step.number
                        ? "text-[#000c79]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] "
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] rounded-3xl blur opacity-20" />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20"
          >
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 border bg-green-700/20 border-green-100 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
                <svg
                  className="iconLocation text-green-700 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-700 font-medium text-sm">
                  {success}
                </span>
              </div>
            )}

            {error && (
              <div className="mb-6 border bg-red-700/20 border-red-500/80 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
                <svg
                  className="iconLocation text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 font-medium text-sm">
                  {error}
                </span>
              </div>
            )}

            {/* STEP 1: Date Selection */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Sélectionnez la date de location
                </h2>
                <div className="mb-8">
                  <label className="labelLocation">
                    <span className="flex items-center gap-2">
                      <svg
                        className="iconLocation"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Date de location
                    </span>
                  </label>
                  <input
                    type="date"
                    className="inputLocation border-[#000c79]"
                    value={locationDate}
                    onChange={(e) => setLocationDate(e.target.value)}
                    required
                  />
                  {loadingModels && (
                    <p className="text-sm text-[#000c79] mt-2 flex items-center gap-2">
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
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Rental Information */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Informations de location
                </h2>

                {/* Costumes Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TbHanger className="iconLocation" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Costumes
                    </h3>
                  </div>

                  {costumes.map((c, index) => (
                    <div key={index} className="categoryContainer">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 items-end">
                        <div>
                          <label className="labelLocation">Modèle</label>
                          <select
                            value={c.model}
                            onChange={(e) =>
                              handleCostumeChange(
                                index,
                                "model",
                                e.target.value,
                              )
                            }
                            className="inputLocation"
                            required
                            disabled={!locationDate || loadingModels}
                          >
                            <option value="">Sélectionner un modèle</option>
                            {availableModels.costumes.map((model) => (
                              <option key={model.model} value={model.model}>
                                {model.model}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="labelLocation">Taille Blazer</label>
                          <input
                            type="text"
                            placeholder="Ex: 48, 50, 52"
                            value={c.blazer}
                            onChange={(e) =>
                              handleCostumeChange(
                                index,
                                "blazer",
                                e.target.value,
                              )
                            }
                            className="inputLocation"
                          />
                        </div>

                        <div>
                          <label className="labelLocation">
                            Taille Pantalon
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 46, 48, 50"
                            value={c.pant}
                            onChange={(e) =>
                              handleCostumeChange(index, "pant", e.target.value)
                            }
                            className="inputLocation"
                          />
                        </div>

                        <div className="flex gap-2 items-end">
                          <button
                            type="button"
                            onClick={() => verifyCostume(c, index)}
                            className="flex-1 bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] hover:opacity-80 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm font-medium"
                          >
                            Vérifier
                          </button>
                          {costumes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCostume(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Supprimer ce costume"
                            >
                              <MdOutlineCancel className="text-2xl" />
                            </button>
                          )}
                        </div>
                      </div>

                      {verificationMessages[index] && (
                        <div
                          className={`mt-3 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            verificationMessages[index].startsWith("✅")
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : verificationMessages[index].startsWith("⚠️")
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          <span>{verificationMessages[index]}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCostume}
                    className="mt-2 flex items-center gap-2 bg-white border-2 border-[#000c79] text-[#000c79] px-5 py-2.5 rounded-xl hover:bg-blue-500/20 transition-colors font-medium"
                  >
                    <svg
                      className="iconLocation"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Ajouter un autre costume
                  </button>
                </div>

                {/* Chemise Section */}
                <div className="categoryContainer">
                  <div className="flex items-center gap-2 mb-4">
                    <RiShirtLine className="iconLocation" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Chemise
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="labelLocation">Modèle</label>
                      <select
                        value={chemise.model}
                        onChange={(e) =>
                          setChemise({ ...chemise, model: e.target.value })
                        }
                        className="inputLocation"
                        disabled={!locationDate || loadingModels}
                      >
                        <option value="">Sélectionner un modèle</option>
                        {availableModels.chemises.map((model) => (
                          <option key={model.model} value={model.model}>
                            {model.model}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="labelLocation">Taille</label>
                      <input
                        type="text"
                        placeholder="Ex: S, M, L, XL"
                        value={chemise.size}
                        onChange={(e) =>
                          setChemise({ ...chemise, size: e.target.value })
                        }
                        className="inputLocation"
                      />
                    </div>
                  </div>
                </div>

                {/* Chaussure Section */}
                <div className="categoryContainer">
                  <div className="flex items-center gap-2 mb-4">
                    <LiaShoePrintsSolid className="iconLocation" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Chaussures
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="labelLocation">Modèle</label>
                      <select
                        value={chaussure.model}
                        onChange={(e) =>
                          setChaussure({ ...chaussure, model: e.target.value })
                        }
                        className="inputLocation"
                        disabled={!locationDate || loadingModels}
                      >
                        <option value="">Sélectionner un modèle</option>
                        {availableModels.chaussures.map((model) => (
                          <option key={model.model} value={model.model}>
                            {model.model}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="labelLocation">Pointure</label>
                      <input
                        type="text"
                        placeholder="Ex: 40, 41, 42"
                        value={chaussure.size}
                        onChange={(e) =>
                          setChaussure({ ...chaussure, size: e.target.value })
                        }
                        className="inputLocation"
                      />
                    </div>
                  </div>
                </div>

                {/* Accessoires Section */}
                <div className="categoryContainer">
                  <div className="flex items-center gap-2 mb-4">
                    <IoIosBowtie className="iconLocation" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Accessoires
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {accessory.map((acc) => (
                      <label
                        key={acc}
                        className="flex items-center gap-3 p-3 border-2 border-blue-500/25 rounded-xl hover:bg-blue-200/15 cursor-pointer transition-colors"
                      >
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
                          className="w-5 h-5 text-[#000c79] border-[#000c79] rounded focus:ring-[#000c79] focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {acc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Client Information */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Informations client
                </h2>

                <div className="categoryContainer">
                  <div className="flex items-center gap-2 mb-4">
                    <FaRegUser className="iconLocation" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Informations Client
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="labelLocation">Nom</label>
                      <input
                        type="text"
                        placeholder="Nom du client"
                        value={client.name}
                        onChange={(e) =>
                          setClient({ ...client, name: e.target.value })
                        }
                        className="inputLocation"
                        required
                      />
                    </div>
                    <div>
                      <label className="labelLocation">N° tel</label>
                      <input
                        type="text"
                        placeholder="Ex: 06XX XXX XXX"
                        value={client.phone}
                        onChange={(e) =>
                          setClient({ ...client, phone: e.target.value })
                        }
                        className="inputLocation"
                        required
                      />
                    </div>
                    <div>
                      <label className="labelLocation">Versement</label>
                      <input
                        type="number"
                        placeholder="Prix du versement"
                        value={client.vers}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            vers: parseFloat(e.target.value),
                          })
                        }
                        className="inputLocation"
                        required
                      />
                    </div>
                    <div>
                      <label className="labelLocation">
                        Prix total de location
                      </label>
                      <input
                        type="number"
                        placeholder="Total"
                        value={prixTotal}
                        onChange={(e) =>
                          setPrix(parseFloat(e.target.value) || 0)
                        }
                        className="inputLocation"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="labelLocation">Ajouter une remarque</label>
                    <textarea
                      className="inputLocation"
                      rows={5}
                      placeholder="commentaire ici..."
                      value={client.comment}
                      onChange={(e) =>
                        setClient({ ...client, comment: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <MdNavigateBefore className="text-xl" />
                  Précédent
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !canProceedToStep2()) ||
                    (currentStep === 2 && !canProceedToStep3())
                  }
                  className="flex items-center gap-2 bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79]  hover:from-blue-800 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Suivant
                  <MdNavigateNext className="text-xl" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Confirmer la location
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Page;