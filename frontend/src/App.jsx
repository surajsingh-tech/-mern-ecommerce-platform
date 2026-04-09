import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import About from "./pages/About";
import MainLayput from "./components/MainLayput";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import Products from "./pages/ProductsPage";
import Cart from "./pages/Cart";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayput />,
      children: [
        {
          index: true,
          element: (
            <>
              <Home /> <Footer />
            </>
          ),
        },
        { path: "/about", element: <About /> },
        { path: "/profile/:userId", element: <Profile /> },
        { path: "/products", element: <Products/> },
        { path: "/cart", element: <Cart/> },

      ],
    },
    {
      path: "/signup",
      element: (
        <>
          <Signup />
        </>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/verify",
      element: <Verify />,
    },
    {
      path: "/verify/:token",
      element: <VerifyEmail />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
