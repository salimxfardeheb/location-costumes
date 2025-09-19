"use server";
import { get_all_category_cloth } from "@/app/firebase/getCategoryCloth";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    category: string;
  };
}

const page = async ({ params }: Props) => {
  const { category } = await params;

  const result = await get_all_category_cloth(category);

  return (
    <div className="flex flex-col justify-center items-center gap-9">
      <div className="px-[3.5%] flex flex-wrap gap-32 w-full">
        {result.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center w-fit"
          >
          <Link href={`${category}/${item.model}`} className="hover:scale-105 duration-100">
            <img
              src={item.image || "/placeholder.png"}
              alt={item.model}
              className="max-w-56 h-64 object-cover rounded-xl shadow"
            />
            <p className="text-xl font-mono mt-2">
              modèle: <span>{item.model}</span>
            </p>
            
          </Link>
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
