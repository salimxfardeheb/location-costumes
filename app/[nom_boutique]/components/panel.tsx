import React, { useState } from "react";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdAddCircle } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import Logout from "./logout";

interface PanelProps {
  clientName?: string;
}

const panel : React.FC<PanelProps> = ({clientName}) => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);
  const handlePanel = () => {
    if (!panelIsOpen) setPanelIsOpen(true);
    else {
      setPanelIsOpen(false);
    }
  };
  return (
    <div className="">
      <nav
        className={`${
          panelIsOpen ? "w-1/6 " : "w-12"
        } min-h-screen bg-[#06B9AE] flex flex-col justify-between`}
      >
        <div className="w-full">
          <div className="w-full">
            <button
              className="flex justify-center items-center p-3 w-full"
              onClick={handlePanel}
            >
              {panelIsOpen ? (
                <div className="flex justify-between items-end w-full pr-4"><LuPanelLeftClose className="panelButton" /><div className="text-white">{clientName}</div></div>
              ) : (
                <LuPanelLeftOpen className="panelButton" /> 
              )}
            </button>
            
          </div>
          <div className="w-full h-[1px] bg-[#B6FFF6]" />
          <div
            className={`${
              panelIsOpen ? "items-start" : "items-center"
            } flex flex-col gap-4 py-3 px-2 justify-center`}
          >
            <div className="itemPanel">
              <TbLayoutDashboardFilled className="panelButton" />
              {panelIsOpen && <p className="text-[#B6FFF6]">Dashboard</p>}
            </div>
            <div className="itemPanel">
              <IoMdAddCircle className="panelButton" />
              {panelIsOpen && (
                <p className="text-[#B6FFF6]">Ajouter une location</p>
              )}
            </div>
            <div className="itemPanel">
              <FaCalendarAlt className="panelButton" />
              {panelIsOpen && <p className="text-[#B6FFF6]">Calendrier</p>}
            </div>
          </div>
        </div>
        <div>{panelIsOpen && <Logout />}</div>
      </nav>
    </div>
  );
};

export default panel;
