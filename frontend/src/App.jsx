import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import About from "./pages/About";
import MainLayput from "./components/MainLayput";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayput/>,
      children: [
        { index: true, element: <Home /> },
        { path: "/about", element: <About /> },
      ],
    },
    {
      path: "/signup",
      element: (
        <>
          {" "}
          <Signup />{" "}
        </>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
