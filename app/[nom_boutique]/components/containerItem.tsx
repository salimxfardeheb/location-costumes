'use client'
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { categories } from "@/app/functions";
import React from "react";

const ContainerItem = () => {
  const { nom_boutique } = useParams();
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex flex-row justify-around gap-4 md:gap-8 mt-4 md:mt-0 text-base md:text-lg font-semibold bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79] text-white py-4 px-4 rounded-2xl shadow-lg">
        {categories.map((link) => (
          <li key={link} className="flex-1 text-center">
            <Link
              href={"/" + nom_boutique + "/profile/" + link}
              className={`${
                currentPath.startsWith(`/${nom_boutique}/profile/${link}`)
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-white/70 hover:text-white"
              } transition-all duration-200 ease-in-out inline-block`}
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContainerItem;