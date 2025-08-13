import React from "react";

const navBar = () => {
  const now: Date = new Date();
  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <p className="text-5xl font-black">{formattedDate}</p>
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
