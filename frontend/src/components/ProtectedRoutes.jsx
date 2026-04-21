import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({
  children,
  adminOnly = false,
  userOnly = false,
}) {
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // admin restriction
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // user-only restriction (block admin)
  if (userOnly && user.role !== "user") {
    return <Navigate to="/" />;
  }

  return children;
}