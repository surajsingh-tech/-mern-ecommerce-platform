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
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import AdminSales from "./pages/adminPages/AdminSales";
import AddProduct from "./pages/adminPages/AddProduct";
import AdminOrders from "./pages/adminPages/AdminOrders";
import AdminProduct from "./pages/adminPages/AdminProduct";
import AdminUsers from "./pages/adminPages/AdminUsers";
import ShowUserOrders from "./pages/adminPages/ShowUserOrders";
import UserInfo from "./pages/adminPages/UserInfo";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PageNotFound from "./pages/PageNotFound";
import SingleProduct from "./pages/SingleProduct";

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
        { path: "about", element: <About /> },
        {
          path: "profile/:userId",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        { path: "products", element: <Products /> },
        { path: "products/:id", element: <SingleProduct /> },
        {
          path: "cart",
          element: (
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoutes adminOnly={true}>
              {" "}
              <AdminDashboard />{" "}
            </ProtectedRoutes>
          ),
          children: [
            { path: "sales", element: <AdminSales /> },
            { path: "add-product", element: <AddProduct /> },
            { path: "admin-deshboard", element: <AdminDashboard /> },
            { path: "orders", element: <AdminOrders /> },
            { path: "products", element: <AdminProduct /> },
            { path: "users", element: <AdminUsers /> },
            { path: "users/orders/:userId", element: <ShowUserOrders /> },
            { path: "users/:id", element: <UserInfo /> },
          ],
        },
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
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
