import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const containerItem = () => {
  const links = ["costume", "shirt", "shoe", "accessory"];
    const { nom_boutique } = useParams();
      const currentPath = usePathname();

  return (
    <div>
      <ul className="flex flex-row justify-around gap-4 md:gap-8 mt-4 md:mt-0 text-xl font-medium">
        {links.map((link) => (
          <li key={link} className="pb-2">
            <Link href={"/"+nom_boutique+"/profile/"+link}
        className={`${"/"+nom_boutique+"/profile/"+link === currentPath ? "text-[#06B9AE] border-b-2" : "text-[#767373]"}  ease-linear duration-100`}
            >{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default containerItem;
