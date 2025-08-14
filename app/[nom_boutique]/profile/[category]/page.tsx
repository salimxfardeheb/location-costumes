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
  const { category } = await params;
  const session = await getServerSession(authOptions);
  const boutiqueIdStr = session?.user?.boutiqueId;

  if (!boutiqueIdStr) {
    throw new Error("Boutique ID manquant");
  }

  const boutiqueId = parseInt(boutiqueIdStr, 10);
  const result = getcategoryCloth(category, boutiqueId);

  return (
    <div className="flex flex-col justify-center items-center gap-9">
      <div className="px-[3.5%] flex flex-wrap gap-32 w-full">
        <div className="flex flex-col justify-center items-center w-fit">
          <img src="/moustache.png" alt="" className="max-w-56 h-64" />
          <p className="text-xl font-mono">
            model n° : <span>1</span>
          </p>
        </div>
      </div>
      <Link href={category + "/addModel"} className="bg-[#F39C12] text-white text-lg font-medium px-5 py-2 rounded-2xl hover:opacity-90">Ajouter un model</Link>
    </div>
  );
};

export default page;
