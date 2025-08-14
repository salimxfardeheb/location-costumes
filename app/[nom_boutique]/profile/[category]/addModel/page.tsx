"use client";
import React from "react";
import Costumes from "./components/costumes";
import Shirt from "./components/shirt";
import Shoe from "./components/shoe";
import Accessory from "./components/accessory";
import { usePathname } from "next/navigation";

const page = () => {
  const pathName = usePathname();
  return (
    <div>
      {pathName.includes("costume") && <Costumes />}
      {pathName.includes("shirt") && <Shirt />}
      {pathName.includes("shoe") && <Shoe />}
      {pathName.includes("accessory") && <Accessory />}
    </div>
  );
};

export default page;
