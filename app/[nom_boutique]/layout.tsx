"use client";
import React, { ReactNode, useState } from "react";
import Panel from "./components/panel";

const Layout = ({ children }: { children: ReactNode }) => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Panneau latéral */}
      <Panel
        clientName="salim"
        panelIsOpen={panelIsOpen}
        setPanelIsOpen={setPanelIsOpen}
      />

      {/* Contenu principal */}
      <main className="flex-1 p-4 bg-gray-50 transition-all duration-200">
        {children}
      </main>
    </div>
  );
};

export default Layout;
