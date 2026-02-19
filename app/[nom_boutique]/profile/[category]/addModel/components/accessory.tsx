"use client";
import { create_item_cloth } from "@/app/firebase/createCategoryCloth";
import { handleUpload } from "@/app/functions";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiUpload, FiCheck, FiX, FiImage, FiPlus } from "react-icons/fi";

const PRESET_TYPES = ["Cravate", "Papillon", "Ceinture", "Montre"];

const Accessory = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const { nom_boutique } = useParams();
  const router = useRouter();

  const handleSelectPreset = (type: string) => {
    setModel(type);
    setCustomMode(false);
    setCustomInput("");
  };

  const handleEnableCustom = () => {
    setModel("");
    setCustomMode(true);
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    setModel(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl || !model) return;
    setIsSubmitting(true);
    await create_item_cloth({
      type_collection: "accessoire",
      model,
      image_path: uploadedUrl,
      description: text,
    });
    setShowSuccess(true);
    setModel("");
    setText("");
    setPreview(null);
    setUploadedUrl(null);
    setCustomMode(false);
    setCustomInput("");
    setIsSubmitting(false);
    setTimeout(() => {
      setShowSuccess(false);
      router.push(`/${nom_boutique}/profile/accessoire`);
    }, 2000);
  };

  const isFormValid = model.trim() && uploadedUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="bg-green-500 text-white rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg">
            <FiCheck className="text-2xl" />
            <span className="font-semibold">Accessoire créé avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'accessoire */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Type d'accessoire *
            </h3>
            {model && (
              <p className="text-sm text-gray-500 mb-4">
                Sélectionné : <span className="font-semibold text-[#000c79]">{model}</span>
              </p>
            )}
            {!model && <p className="text-sm text-gray-400 mb-4">Choisissez un type ci-dessous</p>}

            {/* Preset buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {PRESET_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectPreset(type)}
                  className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 font-semibold text-base transition-all hover:scale-[1.02] active:scale-95 ${
                    model === type && !customMode
                      ? "bg-[#000c79]/5 border-[#000c79] text-[#000c79] shadow-md"
                      : "bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {model === type && !customMode && (
                    <FiCheck className="text-[#000c79] text-lg" strokeWidth={2.5} />
                  )}
                  <span>{type}</span>
                </button>
              ))}
            </div>

            {/* Custom type */}
            {!customMode ? (
              <button
                type="button"
                onClick={handleEnableCustom}
                className="flex items-center gap-2 px-4 py-3 w-full border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#000c79] hover:text-[#000c79] transition-all font-medium text-sm"
              >
                <FiPlus className="text-base" />
                Autre type d'accessoire...
              </button>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Ex: Pochette, Chapeau, Bretelles..."
                  className="w-full px-4 py-3 border-2 border-[#000c79] rounded-xl focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base font-medium pr-10"
                  value={customInput}
                  onChange={(e) => handleCustomChange(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomMode(false);
                    setCustomInput("");
                    setModel("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <label className="block">
              <span className="text-lg font-semibold text-gray-800 mb-1 block">
                Description
                <span className="text-sm font-normal text-gray-500 ml-2">(optionnel)</span>
              </span>
              <p className="text-sm text-gray-400 mb-3">Couleur, matière, détails spécifiques...</p>
              <textarea
                placeholder="Ex: Cravate en soie bleu marine, motif rayures fines..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#000c79] focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base min-h-[100px] resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          </div>

          {/* Upload Image */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <span className="text-lg font-semibold text-gray-800 mb-3 block">
              Image de l'accessoire *
            </span>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#000c79] transition-all">
              <input
                type="file"
                className="hidden"
                id="file-upload-accessory"
                accept="image/*"
                onChange={(e) =>
                  handleUpload(e, setPreview, setUploadedUrl, typeof nom_boutique === "string" ? nom_boutique : "")
                }
              />
              <label htmlFor="file-upload-accessory" className="cursor-pointer block">
                {preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={preview} alt="preview" className="w-64 h-80 object-cover rounded-xl shadow-md" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setPreview(null); setUploadedUrl(null); }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FiX /> Supprimer l'image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <FiImage className="text-6xl text-gray-400" />
                    <p className="text-lg font-medium">Cliquez pour sélectionner une image</p>
                    <p className="text-sm">PNG, JPG jusqu'à 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold text-lg">
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#000c79] to-[#000a35] text-white rounded-xl hover:from-[#000a35] hover:to-[#000c79] transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Création en cours...</>
              ) : (
                <><FiUpload className="text-xl" /> Ajouter l'accessoire</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Accessory;