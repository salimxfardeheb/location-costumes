import React, { ReactNode } from "react";
import ContainerItem from "../components/containerItem";

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="flex flex-col mt-6 mx-4 gap-10">
        <p className="text-3xl font-bold">Ma Boutique</p>
        <ContainerItem/>
        {children}
    </div>
  );
};

export default Layout;
