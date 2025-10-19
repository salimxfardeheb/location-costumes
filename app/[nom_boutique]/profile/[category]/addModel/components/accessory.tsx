import { create_item_cloth } from "@/app/firebase/createCategoryCloth";
import { handleUpload } from "@/app/functions";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const accessory = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [text, setText] = useState("");
  const [contentMessage, setContentMessage] = useState("");
  const label = ["Cravate", "Papillion", "Ceinture", "Montre"];
  const { nom_boutique } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;
    const item = {
      type_collection: "accessoire",
      model: model,
      image_path: uploadedUrl,
      description: text,
    };

    await create_item_cloth(item);
    setContentMessage("✅ Modèle créé avec succès !");
    setModel("");
    setText("");
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
        className="flex flex-col justify-center items-start mx-auto w-fit space-y-8"
      >
        <label
          htmlFor="taille"
          className="flex gap-10 justify-between w-2/5 text-nowrap "
        >
          <span className="text-xl">selectionner le model :</span>
          <ul className="flex gap-10">
            {label.map((c) => (
              <li key={c} className="flex gap-2.5">
                <input
                  type="radio"
                  name="model"
                  checked={model === c}
                  value={c}
                  onChange={() => setModel(c)} required
                />
                <p className="text-nowrap">{c}</p>
              </li>
            ))}
          </ul>
        </label>
        <label
          htmlFor="model"
          className="flex justify-start items-center gap-10"
        >
          <span className="text-xl text-nowrap">Description :</span>
          <input
            type="text"
            placeholder="Description"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0 min-w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
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
              handleUpload(
                e,
                setPreview,
                setUploadedUrl,
                typeof nom_boutique === "string" ? nom_boutique : ""
              );
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

export default accessory;
