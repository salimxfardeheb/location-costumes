import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const navBar = () => {
  
  const now: Date = new Date();
  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const { nom_boutique } = useParams();
  const shop_name_upperCase = nom_boutique?.toLocaleString().toLocaleUpperCase()
  
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <p className="text-5xl font-black">{formattedDate}</p>
        <p className="text-3xl font-black text-[#06B9AE] border-4 rounded-3xl px-4 py-2 text-center tracking-widest">
          {shop_name_upperCase}
        </p>
        <Link href={"addLocation"} className="bg-[#F39C12] text-white text-lg font-medium px-5 py-2 rounded-2xl hover:opacity-90">
          Ajouter une location
        </Link>
      </div>
    </div>
  );
};

export default navBar;
