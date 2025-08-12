"use client"
import React, { ReactNode } from "react";
import Panel from "./components/panel";

const layout = ({ children }: { children: ReactNode }) => {

  return (
    <div>
      <aside><Panel clientName = "salim"/></aside>
      <main>{children}</main>
    </div>
  );
};

export default layout;
