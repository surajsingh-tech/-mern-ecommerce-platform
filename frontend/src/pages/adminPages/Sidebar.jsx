import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  UserRoundPlus,
  Users,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { user } = useSelector((store) => store.user) || {};
  const [open, setOpen] = useState(false);

  const navItemStyle = ({ isActive }) =>
    `flex items-center gap-3 text-sm sm:text-base font-medium p-3 rounded-lg transition
     ${
       isActive ? "bg-pink-600 text-white" : "text-gray-700 hover:bg-pink-100"
     }`;

  return (
    <>
      {/* 🔴 MOBILE BUTTON (Navbar ke niche) */}
      <div className="md:hidden fixed top-[70px] left-3 z-40">
        <button
          onClick={() => setOpen(true)}
          className="bg-white p-2 rounded-md shadow"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 🔴 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔴 SIDEBAR */}
      <aside
        className={`
        fixed left-0 z-50 
        top-[70px] h-[calc(100vh-70px)]
        w-[240px] sm:w-[260px]
        bg-white border-r shadow-sm
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        `}
      >
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          <NavLink to="/dashboard/sales" className={navItemStyle}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/dashboard/add-product" className={navItemStyle}>
            <PackagePlus size={18} /> Add Product
          </NavLink>

          <NavLink to="/dashboard/products" className={navItemStyle}>
            <PackageSearch size={18} /> Products
          </NavLink>

          <NavLink to="/dashboard/users" className={navItemStyle}>
            <Users size={18} /> Users
          </NavLink>

          <NavLink to="/dashboard/orders" className={navItemStyle}>
            <FaRegEdit size={18} /> Orders
          </NavLink>

          <NavLink to={`/profile/${user?._id}`} className={navItemStyle}>
            <UserRoundPlus size={18} /> Profile
          </NavLink>
        </div>
      </aside>
    </>
  );
}
