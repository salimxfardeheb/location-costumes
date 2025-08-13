import React from "react";

const navBar = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <p className="text-5xl font-black">Vendredi, 1 Aout 2025</p>
        <p className="text-3xl font-black text-[#06B9AE] border-4 rounded-3xl px-4 py-2 text-center">
          Nom de la boutique
        </p>
        <button className="bg-[#F39C12] text-white text-lg font-medium px-5 py-2 rounded-2xl hover:opacity-90">
          Ajouter une location
        </button>
      </div>
    </div>
  );
};

export default navBar;
