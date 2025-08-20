"use client";
import React, { ReactNode, useState } from "react";
import Panel from "./components/panel";
import NavBar from "./components/navBar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Panel
        panelIsOpen={panelIsOpen}
        setPanelIsOpen={setPanelIsOpen}
      />
      <main className="flex-1 p-4 bg-gray-50 transition-all duration-200">
        <NavBar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
