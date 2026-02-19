import React, { ReactNode } from "react";
import ContainerItem from "../components/containerItem";
import { CiShop } from "react-icons/ci";

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-[#000c79] to-[#000a35] p-3 rounded-xl shadow-lg">
            <CiShop  className="text-white text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Ma Boutique</h1>
        </div>
        
        {/* Navigation tabs */}
        <div className="mb-8">
          <ContainerItem />
        </div>
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;