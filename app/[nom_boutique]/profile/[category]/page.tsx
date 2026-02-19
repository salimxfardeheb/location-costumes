"use server";
import { get_all_category_cloth } from "@/app/firebase/getCategoryCloth";
import Link from "next/link";
import React from "react";
import { FiPlus, FiPackage } from "react-icons/fi";
import { TbHanger } from "react-icons/tb";
import { RiShirtLine } from "react-icons/ri";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { IoIosBowtie } from "react-icons/io";
interface Props {
  params: {
    category: string;
  };
}

const Page = async ({ params }: Props) => {
  const { category } = await params;

  const data = await get_all_category_cloth(category);
  
  // Tri alphabétique par modèle (insensible à la casse)
  const result = data.sort((a, b) => 
    a.model.toLowerCase().localeCompare(b.model.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header avec compteur */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              {category == 'costume' && (<TbHanger className="text-[#000c79] text-2xl" />)}
              {category == 'chemise' && (<RiShirtLine className="text-[#000c79] text-2xl" />)}
              {category == 'chaussure' && (<LiaShoePrintsSolid className="text-[#000c79] text-2xl" />)}
              {category == 'accessoire' && (<IoIosBowtie className="text-[#000c79] text-2xl" />)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{category}</h2>
              <p className="text-gray-600 text-sm">{result.length} modèle{result.length > 1 ? 's' : ''} disponible{result.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <Link
            href={`${category}/addModel`}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#000c79] to-[#000a35] text-white rounded-xl hover:from-[#000a35] hover:to-[#000c79] transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <FiPlus className="text-lg" />
            Ajouter un modèle
          </Link>
        </div>
      </div>

      {/* Liste des modèles */}
      {result.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-500 font-medium mb-2">Aucun modèle disponible</p>
          <p className="text-gray-400 text-sm mb-6">Commencez par ajouter votre premier modèle</p>
          <Link
            href={`${category}/addModel`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#000c79] to-[#000a35] text-white rounded-xl hover:from-[#000a35] hover:to-[#000c79] transition-all font-semibold shadow-lg"
          >
            <FiPlus className="text-lg" />
            Ajouter un modèle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {result.map((item, index) => (
              <Link
                key={index}
                href={`${category}/${item.model}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#000c79]">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.model}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Modèle</p>
                    <p className="text-base font-bold text-gray-800 truncate group-hover:text-[#000c79] transition-colors">
                      {item.model}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;