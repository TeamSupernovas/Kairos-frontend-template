import React, { Component } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaSearch, FaBell } from "react-icons/fa";
import LogoutButton from "./components/LogoutButton";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-gray-800 text-white p-4 shadow-md">
        <div className="flex-grow text-center text-green-500 text-xl font-bold">
          Kairos
        </div>
        <LogoutButton />
      </header>

      {/* Page Content */}
      <div className="flex-grow">
        <Outlet />
      </div>


      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 shadow-lg">
      <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-yellow-400" : "text-white"}`
          }
        >
          <FaUser size={24} />
          <span className="text-sm">Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-yellow-400" : "text-white"}`
          }
        >
          <FaSearch size={24} />
          <span className="text-sm">Search</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-yellow-400" : "text-white"}`
          }
        >
          <FaBell size={24} />
          <span className="text-sm">Notifications</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-yellow-400" : "text-white"}`
          }
        >
          <FaUser size={24} />
          <span className="text-sm">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
