import React from "react";
import NavItem from "./NavItem";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed flex z-modal items-center justify-between w-3/4 p-4 translate-x-[-50%] rounded-lg shadow-md left-1/2 top-2xl bg-card animate-fadeIn">
      <div className="absolute translate-x-[-50%] left-1/2 bottom-1/3">
        <div className="rounded-full shadow-md p-sm bg-card shadow-primary-500">
          {" "}
          <Icon className="text-4xl" icon="mingcute:album-fill" />
        </div>
      </div>
      <div className="flex space-x-4">
        <NavItem to="/" className="">
          Home
        </NavItem>
        <NavItem to="/about" className="">
          About
        </NavItem>
      </div>
      <div className="flex space-x-4">
        <NavItem to="/signup" className="">
          Sign Up
        </NavItem>
        <NavItem to="/login" className="">
          Login
        </NavItem>
      </div>
    </nav>
  );
};

export default Navbar;
