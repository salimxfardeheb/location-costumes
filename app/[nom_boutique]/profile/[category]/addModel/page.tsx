"use client";
import React from "react";
import Costumes from "./components/costumes";
import Shirt from "./components/shirt";
import Shoe from "./components/shoe";
import Accessory from "./components/accessory";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathName = usePathname();
  return (
    <div>
      {pathName.includes("costume") && <Costumes />}
      {pathName.includes("chemise") && <Shirt />}
      {pathName.includes("chaussure") && <Shoe />}
      {pathName.includes("accessoire") && <Accessory />}
    </div>
  );
};

export default Page;
