import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setCart } from "@/redux/productSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false;
  const cart = useSelector((store) => store.product?.cart || []);
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        dispatch(setCart([]));
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-18 h-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600 transition">
            Products
          </Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              className="hover:text-blue-600 transition"
            >
              {user?.firstName}
            </Link>
          )}

          {admin && (
            <Link to={`/dashboard/sales`} className="hover:text-blue-600 transition">
              Dashboard
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {/* Auth Button */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 text-white hover:bg-pink-700"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md px-6 py-4 space-y-4 z-50">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Products
          </Link>

          {user && (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Hello User
            </Link>
          )}

          {admin && (
            <Link to={`/dashboard`} className="block">
              Dashboard
            </Link>
          )}

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <ShoppingCart /> Cart ({cart?.items?.length || 0})
          </Link>

          {user ? (
            <Button
              onClick={logoutHandler}
              className="w-full bg-pink-600 text-white"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
