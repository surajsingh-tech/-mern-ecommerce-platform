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
import ShowUserOrders from "./pages/adminPages/ShowUsersOrder";
import UserInfo from "./pages/adminPages/UserInfo";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PageNotFound from "./pages/PageNotFound";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import ForgetPassword from "./pages/ForgotPassword";
import OtpValidation from "./pages/OtpVerify";
import ChangePassword from "./pages/ChangePassword";

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
            <ProtectedRoutes userOnly={true}>
              <Cart />
            </ProtectedRoutes>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoutes userOnly={true}>
              <MyOrders />
            </ProtectedRoutes>
          ),
        },
        {
          path: "address",
          element: (
            <ProtectedRoutes userOnly={true}>
              <AddressForm />
            </ProtectedRoutes>
          ),
        },
        {
          path: "order-success",
          element: (
            <ProtectedRoutes userOnly={true}>
              <OrderSuccess />
            </ProtectedRoutes>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoutes adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoutes>
          ),
          children: [
            { path: "sales", element: <AdminSales /> },
            { path: "add-product", element: <AddProduct /> },
            { path: "orders", element: <AdminOrders /> },
            { path: "products", element: <AdminProduct /> },
            { path: "users", element: <AdminUsers /> },
            { path: "users/orders/:userId", element: <ShowUserOrders /> },
            { path: "users/:userId", element: <UserInfo /> },
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
    { path: "forgot-password", element: <ForgetPassword /> },
    { path: "change-password/:email", element: <ChangePassword /> },
    { path: "verify-otp/:email", element: <OtpValidation /> },
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
