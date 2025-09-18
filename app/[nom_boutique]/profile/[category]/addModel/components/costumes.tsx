"use client";
import { create_item_cloth } from "@/app/firebase/createCategoryCloth";
import { handleUpload } from "@/app/functions";
import React, { useState } from "react";

import { size } from "@/app/firebase/createCategoryCloth";

const Costumes = () => {
  const [model, setModel] = useState("");
  const [blazer, setBlazer] = useState<size[]>([]);
  const [pants, setPants] = useState<size[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [contentMessage, setContentMessage] = useState("");

  const sizes: size[] = [
    { size: "48", locate: false },
    { size: "50", locate: false },
    { size: "52", locate: false },
    { size: "54", locate: false },
    { size: "56", locate: false },
    { size: "58", locate: false },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;

    const item = {
      type_collection: "costume",
      model: model,
      blazerSize: blazer,
      pantSize: pants,
      image_path: uploadedUrl,
    };

    await create_item_cloth(item);

    setContentMessage("✅ Modèle créé avec succès !");
    setModel("");
    setBlazer([]);
    setPants([]);
    setPreview(null);
    setUploadedUrl(null);

    setTimeout(() => setContentMessage(""), 3000);
  };

  const toggleSelectAllBlazers = () => {
    if (blazer.length === sizes.length) {
      setBlazer([]);
    } else {
      setBlazer(sizes);
    }
  };
  const toggleSelectpants = () => {
    if (pants.length === sizes.length) {
      setPants([]);
    } else {
      setPants(sizes);
    }
  };

  return (
    <div>
      {contentMessage && (
        <span className="text-green-600 font-semibold mt-4 block mx-auto w-fit mb-5">
          {contentMessage}
        </span>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center space-y-8"
      >
        <label className="flex justify-start items-center gap-4">
          <span className="text-xl">Model :</span>
          <input
            type="text"
            placeholder="N° Model"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>

        <div className="flex flex-col gap-4 w-2/5">
          <div className="flex justify-between items-center">
            <span className="text-xl">Tailles des blazers :</span>
            <button
              type="button"
              onClick={toggleSelectAllBlazers}
              className="bg-[#36CBC1] text-white px-3 py-1 rounded-md hover:opacity-85"
            >
              {blazer.length === sizes.length
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          </div>
          <ul className="flex gap-7 flex-wrap">
            {sizes.map((size) => (
              <li key={size.size}>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={blazer.some((s) => s.size === size.size)}
                    value={size.size}
                    onChange={(e) =>
                      setBlazer((prev) =>
                        e.target.checked
                          ? [...prev, size]
                          : prev.filter((s) => s.size !== size.size)
                      )
                    }
                  />
                  {size.size}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <label className="flex flex-col gap-10 justify-between w-2/5">
          <div className="flex justify-between items-center">
            <span className="text-xl">Tailles des pantallons :</span>
            <button
              type="button"
              onClick={toggleSelectpants}
              className="bg-[#36CBC1] text-white px-3 py-1 rounded-md hover:opacity-85"
            >
              {pants.length === sizes.length
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          </div>

          <ul className="flex gap-7 flex-wrap">
            {sizes.map((size) => (
              <li key={size.size}>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={pants.some((s) => s.size === size.size)}
                    value={size.size}
                    onChange={(e) =>
                      setPants((prev) =>
                        e.target.checked
                          ? [...prev, size]
                          : prev.filter((s) => s.size !== size.size)
                      )
                    }
                  />
                  {size.size}
                </label>
              </li>
            ))}
          </ul>
        </label>

        <label className="flex flex-col items-start gap-2 cursor-pointer">
          <span className="text-gray-700 font-medium">Insérez une image :</span>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 
               file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-[#06B9AE] file:text-white
               hover:file:bg-[#059e95]
               cursor-pointer"
            onChange={(e) => {
              handleUpload(e, setPreview, setUploadedUrl);
            }}
          />
          {preview && <img src={preview} alt="preview" width={200} />}
        </label>

        <button
          type="submit"
          className="bg-[#F39C12] text-white px-8 py-1.5 rounded-lg hover:opacity-85 cursor-pointer"
        >
          Ajouter le model
        </button>
      </form>
    </div>
  );
};

export default Costumes;
