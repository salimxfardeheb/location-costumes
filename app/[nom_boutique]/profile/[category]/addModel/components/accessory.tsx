import React from "react";

const accessory = () => {
  const sizes = ["Cravate", "Papillion", "Ceinture", "Montre"];
  return (
    <div>
      <form className="flex flex-col justify-center items-start mx-auto w-fit space-y-8">
        <label
          htmlFor="taille"
          className="flex gap-10 justify-between w-2/5 text-nowrap "
        >
          <span className="text-xl">selectionner le model :</span>
          <ul className="flex gap-10">
            {sizes.map((size) => (
              <li key={size} className="flex gap-2.5">
                <input type="radio" />
                <p className="text-nowrap">{size}</p>
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
          />
        </label>
      </form>
    </div>
  );
};

export default accessory;
