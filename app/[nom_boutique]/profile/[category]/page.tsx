"use server";
import { getcategoryCloth } from "@/app/actions/getcategoryCloth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    category: string;
  };
}

const page = async ({ params }: Props) => {
  const { category } = params;
  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;

  if (!boutiqueIdStr) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueId = parseInt(boutiqueIdStr, 10);

  const result = await getcategoryCloth(category, boutiqueId);

  return (
    <div className="flex flex-col justify-center items-center gap-9">
      <div className="px-[3.5%] flex flex-wrap gap-32 w-full">
        {result.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center w-fit"
          >
            <img
              src={item.image || "/placeholder.png"}
              alt={item.model}
              className="max-w-56 h-64 object-cover rounded-xl shadow"
            />
            <p className="text-xl font-mono mt-2">
              modèle n° : <span>{item.model}</span>
            </p>
          </div>
        ))}
      </div>
      <Link
        href={`${category}/addModel`}
        className="bg-[#F39C12] text-white text-lg font-medium px-5 py-2 rounded-2xl hover:opacity-90"
      >
        Ajouter un modèle
      </Link>
    </div>
  );
};

export default page;
