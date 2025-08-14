import React from "react";

const costumes = () => {
  const sizes = ["46", "48", "50", "52", "54", "56", "58"];
  return (
    <div>
      <form className="flex flex-col justify-center items-center space-y-8">
        <label
          htmlFor="model"
          className="flex justify-start items-center gap-4"
        >
          <span className="text-xl">Model :</span>
          <input
            type="text"
            placeholder="N° Model"
            className="bg-[#B6FFF6] px-5 py-2 rounded-xl border-2 border-[#36CBC1] placeholder:text-gray-600 focus-within:placeholder:text-[#36CBC1] focus-within:outline-0"
          />
        </label>
        <label htmlFor="blazer" className="flex gap-10 justify-between w-2/5 ">
          <span className="text-xl">
            selectionner les tailles des blazers :
          </span>
          <ul className="flex gap-7 ">
            {sizes.map((size) => (
              <li key={size}>
                <input type="checkbox" />
                {size}
              </li>
            ))}
          </ul>
        </label>
        <label
          htmlFor="pantalon"
          className="flex gap-10 justify-between w-2/5 "
        >
          <span className="text-xl">
            selectionner les tailles des pantalons :
          </span>
          <ul className="flex gap-7">
            {sizes.map((size) => (
              <li key={size}>
                <input type="checkbox" />
                {size}
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
          />
        </label>
      </form>
    </div>
  );
};

export default costumes;
