"use server";
import { get_category_cloth } from "@/app/actions/firebase/getCategoryCloth";
import Link from "next/link";
import React from "react";


interface Props {
  params: {
    category: string;
  };
}

const page = async ({ params }: Props) => {
  const { category } = await params;
  console.log("result" , category)

  const result = await get_category_cloth(category);
  console.log("result" , result)

  return (
    <div className="flex flex-col justify-center items-center gap-9">
      <div className="px-[3.5%] flex flex-wrap gap-32 w-full">
        {result.map((item, index) => (
          
          <div
            key={index}
            className="flex flex-col justify-center items-center w-fit"
          >
            <img
              src="/uploads/1756045677862-1.jpg" 
              alt={item.model}
              className="max-w-56 h-64 object-cover rounded-xl shadow"
            />
            <p className="text-xl font-mono mt-2">
              modèle n° : <span>{item.model}</span>
            </p>
            <Link href={`${category}/${item.model}`}>see details</Link>
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
