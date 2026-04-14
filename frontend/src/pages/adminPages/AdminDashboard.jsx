import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminDashboard() {
  return (
    <div className="w-full">
      <Sidebar />

      {/* content */}
      <div className="pt-[70px] md:ml-[260px] px-3 sm:px-5 md:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
}
