import React from "react";
import { Outlet } from "react-router-dom";
import Mainnav from "../components/MainNav";

const Layout = () => {
  return (
    <div>
      <Mainnav />
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
