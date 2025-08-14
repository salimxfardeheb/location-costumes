"use client";
import React, { ReactNode, useState } from "react";
import ContainerItem from "../components/containerItem";

const Layout = ({ children }: { children: ReactNode }) => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen mt-12 mx-4 gap-10">
        <p className="text-3xl font-bold">Ma Boutique</p>
        <ContainerItem/>
        {children}
    </div>
  );
};

export default Layout;
