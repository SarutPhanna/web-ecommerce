import React from "react";
import { Link } from "react-router-dom";

const Mainnav = () => {
  return (
    <nav className="bg-green-300">
      <div className="mx-auto px-5">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to={"/"}>Logo</Link>
            <Link to={"/"}>Home</Link>
            <Link to={"shop"}>Shop</Link>
            <Link to={"cart"}>Cart</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to={"register"}>Register</Link>
            <Link to={"login"}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Mainnav;
