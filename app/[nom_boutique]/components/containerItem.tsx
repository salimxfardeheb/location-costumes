'use client'
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { categories } from "@/app/functions";
import React from "react";

const containerItem = () => {
  const { nom_boutique } = useParams();
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex flex-row justify-around gap-4 md:gap-8 mt-4 md:mt-0 text-xl font-medium bg-gradient-to-r from-[#06B9AE] to-[#0A7871] text-white py-4 rounded-md">
        {categories.map((link) => (
          <li key={link} className="">
            <Link
              href={"/" + nom_boutique + "/profile/" + link}
              className={`${
                currentPath.startsWith(`/${nom_boutique}/profile/${link}`)
                  ? "text-[#B6FFF6] border-b-2"
                  : "text-white"
              }  ease-linear duration-100`}
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default containerItem;
