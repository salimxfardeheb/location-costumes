import React from "react";

const page = () => {
  const accessory = [
    "Cravate",
    "Papillion",
    "Ceinture",
    "Bouttons manchettes",
    "Montre",
  ];
  return (
    <div className="my-15 flex flex-col justify-center items-center">
      <form className=" flex flex-col justify-between gap-10 p-6">
        <label htmlFor="Date" className="flex justify-start items-center gap-4">
          <span className="text-xl">Selectionner La date :</span>
          <input
            type="date"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
          />
        </label>
        <div className="flex gap-10 w-full">
          <label
            htmlFor="Costume"
            className="flex gap-4 justify-start items-center"
          >
            <span className="text-xl">Model : </span>
            <input
              type="text"
              placeholder="N° Model"
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">blazer : </span>
            <input
              type="text"
              placeholder="Size"
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
          <label className="flex justify-start items-center gap-4">
            <span className="text-xl">Pants : </span>
            <input
              type="text"
              placeholder="Size"
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
        </div>
        <div className="flex gap-10 w-full">
          <label
            htmlFor="Chemise"
            className="flex gap-4 justify-start items-center"
          >
            <span className="text-xl">Chemise : </span>
            <input
              type="text"
              placeholder="N° Model"
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
          <label
            className="flex justify-start items-center gap-4"
            htmlFor="Chemise-taille"
          >
            <span className="text-xl">Taille : </span>
            <input
              type="text"
              placeholder="Size"
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
        </div>
        <div className="flex gap-10 w-full">
          <label
            htmlFor="Chaussure"
            className="flex gap-4 justify-start items-center"
          >
            <span className="text-xl">Chaussure : </span>
            <input
              type="text"
              placeholder="N° Model"
              className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
          <label
            className="flex justify-start items-center gap-4"
            htmlFor="Chaussure-taille"
          >
            <span className="text-xl">Pointure : </span>
            <input
              type="text"
              placeholder="Size"
              className="w-1/3 bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
            />
          </label>
        </div>
        <label
          htmlFor="accessory"
          className="flex flex-col justify-start items-start gap-4"
        >
          <span className="text-xl">Accessoires :</span>
          <ul className="flex gap-20 text-xl">
            {accessory.map((a) => (
              <li key={a} className="flex gap-4">
                <input type="checkbox" value={a} className="w-4 rounded-full" />{" "}
                {a}
              </li>
            ))}
          </ul>
        </label>
        <button
          type="submit"
          className="bg-[#F39C12] text-white px-8 py-1.5 rounded-lg hover:opacity-85 cursor-pointer mx-auto"
        >
          Ajouter la location
        </button>      </form>
    </div>
  );
};

export default page;
