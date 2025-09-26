import { create_item_cloth, size } from "@/app/firebase/createCategoryCloth";
import { handleUpload } from "@/app/functions";
import React, { useState } from "react";

const shoe = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState<size[]>([]);

  const [contentMessage, setContentMessage] = useState("");

  const Allsizes = [
    { size: "39",location_date : []},
    { size: "40",location_date : []},
    { size: "41",location_date : []},
    { size: "42",location_date : []},
    { size: "43",location_date : []},
    { size: "44",location_date : []},
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;

    const item = {
      type_collection: "chaussure",
      model: model,
      image_path: uploadedUrl,
      size: sizes,
      color: color,
    };

    await create_item_cloth(item);
    setContentMessage("✅ Modèle créé avec succès !");
    setModel("");
    setColor("");
    setSizes([]);
    setPreview(null);
    setUploadedUrl(null);
    setTimeout(() => setContentMessage(""), 3000);
  };

  const toggleSelectSizes = () => {
    if (Allsizes.length === sizes.length) {
      setSizes([]);
    } else {
      setSizes(Allsizes);
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
        className="flex flex-col justify-center items-start mx-auto w-1/2 space-y-8"
      >
        <label
          htmlFor="model"
          className="flex justify-start items-center gap-10"
        >
          <span className="text-xl">Model :</span>
          <input
            type="text"
            placeholder="Model"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>
        <label
          htmlFor="taille"
          className="flex flex-col gap-6 justify-between w-full text-nowrap "
        >
          <div className="flex justify-between pr-10">
            <span className="text-xl">
              Sélectionner les pointures disponibles :
            </span>
            <button
              type="button"
              onClick={toggleSelectSizes}
              className="bg-[#36CBC1] text-white px-3 py-1 rounded-md hover:opacity-85"
            >
              {Allsizes.length === sizes.length
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          </div>
          <ul className="flex gap-7">
            {Allsizes.map((s) => (
              <li key={s.size}>
                <input
                  type="checkbox"
                  checked={sizes.some((ss) => ss.size === s.size)}
                  value={s.size}
                  onChange={(e) =>
                    setSizes((prev) =>
                      e.target.checked
                        ? [...prev, s]
                        : prev.filter((size) => size.size !== s.size)
                    )
                  }
                />
                <p className="text-nowrap">{s.size}</p>
              </li>
            ))}
          </ul>
        </label>
        <label className="flex items-start gap-10 cursor-pointer">
          <span className="text-gray-700 font-medium text-nowrap">
            Insérez une image :
          </span>
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
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-[#F39C12] text-white px-8 py-1.5 rounded-lg hover:opacity-85 cursor-pointer "
          >
            Ajouter le model
          </button>
        </div>
      </form>
    </div>
  );
};

export default shoe;
