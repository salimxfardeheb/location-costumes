"use server";
import { getcategoryCloth } from "@/app/actions/getcategoryCloth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
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

  return <div>{result}</div>;
};

export default page;
