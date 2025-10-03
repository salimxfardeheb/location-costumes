"use server";
import { get_one_location } from "@/app/firebase/getLocations";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    nom_boutique: any;
    location: any;
  };
}

const Page = async ({ params }: Props): Promise<any>=> {
  const { nom_boutique, location } = await params;
  const result = await get_one_location(location);
  console.log(result)
  return (
    <div className="w-full mt-10 px-20">
      <div className="flex justify-between items-center w-full">
        <div className="flex text-2xl gap-3 font-bold w-full">
          <p>Date Sortie :</p>
          <p>
            {result?.date_sortie instanceof Date
              ? result.date_sortie.toLocaleDateString()
              : result?.date_sortie}
          </p>
        </div>
        <div className="w-full h-full flex justify-end">
          <Link
            href={`/${nom_boutique}/dashboard`}
            className="mt-5 px-4 py-2 h-fit bg-gray-600 text-white rounded-lg hover:opacity-85 w-fit justify-end"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-12">
        {/* costume */}
        {result?.costumes && <div className="flex gap-12">
          {result?.costumes.map((model, i) => (
            <div
              key={i}
              className="pt-10 flex flex-col gap-1 w-fit text-lg font-semibold"
            >
              <img
                src={model.image}
                className="max-w-56 h-64 object-cover rounded-xl shadow"
              />
              <div className="px-4 flex flex-col gap-1">
                <div className="details-location">
                  <p>Model :</p>
                  <p>{model.model}</p>
                </div>
                <div className="details-location">
                  <p>Blazer :</p>
                  <p>{model.blazer}</p>
                </div>
                <div className="details-location">
                  <p>Pant :</p>
                  <p>{model.pant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>}
        {/* chemise */}
        {result?.chemise && <div className="py-10 flex flex-col gap-1 w-fit text-lg font-semibold">
          <img
            src={result?.chemise?.image}
            className="max-w-56 h-64 object-cover rounded-xl shadow"
          />
          <div className="px-4 flex flex-col gap-1">
            <div className="details-location">
              <p>Model :</p>
              <p>{result?.chemise?.model}</p>
            </div>
            <div className="details-location">
              <p>taille :</p>
              <p>{result?.chemise?.size}</p>
            </div>
          </div>
        </div>}
        {/* chaussure */}
        {result?.chaussure && <div className="py-10 flex flex-col gap-1 w-fit text-lg font-semibold">
          <img
            src={result?.chaussure?.image}
            className="max-w-56 h-64 object-cover rounded-xl shadow"
          />
          <div className="px-4 flex flex-col gap-1">
            <div className="details-location">
              <p>Model :</p>
              <p>{result?.chaussure?.model}</p>
            </div>
            <div className="details-location">
              <p>pointure :</p>
              <p>{result?.chaussure?.size}</p>
            </div>
          </div>
        </div>}
        {/* accessories */}
        {result?.accessories && <div className="flex gap-12">
          {result?.accessories.map((model, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 pt-10 w-fit text-lg font-semibold"
            >
              <img
                src={model.image}
                className="max-w-56 h-64 object-cover rounded-xl shadow"
              />
              <div className="px-4 flex flex-col gap-1">
                <div className="flex gap-3">
                  <p>Model :</p>
                  <p>{model.model}</p>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default Page;
