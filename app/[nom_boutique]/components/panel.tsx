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

const panel: React.FC<PanelProps> = ({ panelIsOpen, setPanelIsOpen }) => {
  const currentPath = usePathname();
  const { nom_boutique } = useParams();
  const shop_name_upperCase = nom_boutique?.toLocaleString().toWellFormed();

  const menuItems = [
    { label: "Dashboard", path: "dashboard", icon: TbLayoutDashboardFilled },
    { label: "Ajouter une location", path: "addLocation", icon: IoMdAddCircle },
    { label: "Calendrier", path: "calendar", icon: FaCalendarAlt },
  ];

  const handlePanel = () => {
    if (!panelIsOpen) setPanelIsOpen(true);
    else {
      setPanelIsOpen(false);
    }
  };
  return (
    <nav
      className={`${
        panelIsOpen ? "w-1/6 " : "w-12"
      } min-h-screen bg-[#06B9AE] flex flex-col justify-between transition-all duration-200`}
    >
      <div className="w-full">
        <div className="w-full">
          <div className="flex justify-center items-center p-3 w-full">
            {panelIsOpen ? (
              <div className="flex justify-between items-center w-full pr-4 space-x-4">
                <Link
                  className="flex items-center justify-start gap-4 text-[#B6FFF6] hover:bg-[#B6FFF6] hover:text-[#06B9AE] transition-all duration-50 w-full text-2xl px-3 py-0.5 rounded-sm"
                  href={"profile"}
                >
                  <CgProfile className="text-3xl" />
                  {shop_name_upperCase}
                </Link>
                <button onClick={handlePanel}>
                  <LuPanelLeftClose className="text-[#B6FFF6] text-3xl hover:text-white" />
                </button>
              </div>
            ) : (
              <button onClick={handlePanel}>
                <LuPanelLeftOpen className="text-[#B6FFF6] text-3xl hover:text-white" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#B6FFF6]" />
        <div
          className={`${
            panelIsOpen ? "items-start" : "items-center"
          } flex flex-col gap-4 py-3 px-2 justify-center`}
        >
          {menuItems.map(({ label, path, icon: Icon }) => {
            const isActive = currentPath.includes(path);
            return (
              <Link
                href={path}
                key={path}
                className="flex justify-center items-end gap-4 cursor-pointer"
              >
                <Icon
                  className={`text-3xl ${
                    isActive
                      ? "text-white hover:text-[#B6FFF6]"
                      : "text-[#B6FFF6] hover:text-white"
                  }`}
                />
                {panelIsOpen && (
                  <p className="text-[#B6FFF6] whitespace-nowrap hover:text-white">
                    {label}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <div>{panelIsOpen && <Logout />}</div>
    </nav>
  );
};

export default panel;
