"use client";
import { create_item_cloth } from "@/app/firebase/createCategoryCloth";
import { handleUpload, size } from "@/app/functions";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiUpload, FiCheck, FiX, FiImage } from "react-icons/fi";
import SizePicker from "./SizePicker";

const ALL_SIZES: size[] = [
  { size: "XS", location_date: [] },
  { size: "S", location_date: [] },
  { size: "M", location_date: [] },
  { size: "L", location_date: [] },
  { size: "XL", location_date: [] },
  { size: "2XL", location_date: [] },
  { size: "3XL", location_date: [] },
  { size: "4XL", location_date: [] },
  { size: "5XL", location_date: [] },
  { size: "6XL", location_date: [] },
  { size: "7XL", location_date: [] },
];

const Shirt = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [sizes, setSizes] = useState<size[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { nom_boutique } = useParams();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;
    setIsSubmitting(true);
    await create_item_cloth({
      type_collection: "chemise",
      model,
      image_path: uploadedUrl,
      size: sizes,
    });
    setShowSuccess(true);
    setModel("");
    setSizes([]);
    setPreview(null);
    setUploadedUrl(null);
    setIsSubmitting(false);
    setTimeout(() => {
      setShowSuccess(false);
      router.push(`/${nom_boutique}/profile/chemise`);
    }, 2000);
  };

  const isFormValid = model && sizes.length > 0 && uploadedUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="bg-green-500 text-white rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg">
            <FiCheck className="text-2xl" />
            <span className="font-semibold">Modèle créé avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modèle */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <label className="block">
              <span className="text-lg font-semibold text-gray-800 mb-3 block">
                Numéro de modèle *
              </span>
              <input
                type="text"
                placeholder="Ex: CH2024-001"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#000c79] focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </label>
          </div>

          {/* Tailles */}
          <SizePicker
            label="Tailles disponibles *"
            selected={sizes}
            onChange={setSizes}
            availableSizes={ALL_SIZES}
          />
          {/* Upload Image */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <span className="text-lg font-semibold text-gray-800 mb-3 block">
              Image du modèle *
            </span>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#000c79] transition-all">
              <input
                type="file"
                className="hidden"
                id="file-upload-shirt"
                accept="image/*"
                onChange={(e) =>
                  handleUpload(
                    e,
                    setPreview,
                    setUploadedUrl,
                    typeof nom_boutique === "string" ? nom_boutique : "",
                  )
                }
              />
              <label
                htmlFor="file-upload-shirt"
                className="cursor-pointer block"
              >
                {preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-64 h-80 object-cover rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview(null);
                        setUploadedUrl(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FiX /> Supprimer l'image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <FiImage className="text-6xl text-gray-400" />
                    <p className="text-lg font-medium">
                      Cliquez pour sélectionner une image
                    </p>
                    <p className="text-sm">PNG, JPG jusqu'à 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold text-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#000c79] to-[#000a35] text-white rounded-xl hover:from-[#000a35] hover:to-[#000c79] transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Création en cours...
                </>
              ) : (
                <>
                  <FiUpload className="text-xl" /> Ajouter le modèle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shirt;
