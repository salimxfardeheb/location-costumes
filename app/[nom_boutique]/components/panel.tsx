import React, { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";

import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdAddCircle } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

import Logout from "./logout";

interface PanelProps {
  panelIsOpen: boolean;
  setPanelIsOpen: (open: boolean) => void;
}

const Panel: React.FC<PanelProps> = ({ panelIsOpen, setPanelIsOpen }) => {
  const currentPath = usePathname();
  const { nom_boutique } = useParams();
  const shop_name_upperCase = nom_boutique?.toLocaleString().toUpperCase();

  const menuItems = [
    { label: "Dashboard", path: "dashboard", icon: TbLayoutDashboardFilled },
    { label: "Ajouter une location", path: "addLocation", icon: IoMdAddCircle },
    { label: "Calendrier", path: "calendar", icon: FaCalendarAlt },
  ];

  const handlePanel = () => {
    setPanelIsOpen(!panelIsOpen);
  };

  return (
    <nav
      className={`${
        panelIsOpen ? "w-72" : "w-20"
      } min-h-screen bg-gradient-to-b from-[#000c79] via-[#000a35] to-[#000c79] shadow-2xl flex flex-col justify-between transition-all duration-300 ease-in-out relative`}
    >
      {/* Header Section */}
      <div className="w-full">
        <div className="p-4">
          {panelIsOpen ? (
            <div className="flex justify-between items-center gap-3">
              <Link
                className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 flex-1 px-4 py-3 rounded-xl group"
                href={`/${nom_boutique}/profile/costume`}
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-all duration-200">
                  <CgProfile className="text-2xl" />
                </div>
                <span className="font-semibold text-sm truncate">
                  {shop_name_upperCase}
                </span>
              </Link>
              <button
                onClick={handlePanel}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Fermer le panneau"
              >
                <LuPanelLeftClose className="text-white/90 text-2xl hover:text-white transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handlePanel}
                className="p-3 hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Ouvrir le panneau"
              >
                <LuPanelLeftOpen className="text-white/90 text-2xl hover:text-white transition-colors" />
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Menu Items */}
        <div className="flex flex-col gap-2 py-6 px-3">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const isActive = currentPath.includes(path);
            return (
              <Link
                href={`/${nom_boutique}/${path}`}
                key={path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? "bg-white text-[#000c79] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#000c79] rounded-r-full" />
                )}
                
                <div className={`${panelIsOpen ? "" : "mx-auto"}`}>
                  <Icon
                    className={`text-2xl transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                </div>
                
                {panelIsOpen && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {label}
                  </span>
                )}
                
                {/* Hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-200 rounded-xl" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-3">
        {panelIsOpen && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Panel;