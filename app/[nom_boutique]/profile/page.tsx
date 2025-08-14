"use client";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const links = ["costumes", "chemise", "chaussures", "accessoires"];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="mt-12 mx-4">
closed
      </div>
    </>
  );
};

export default page;
