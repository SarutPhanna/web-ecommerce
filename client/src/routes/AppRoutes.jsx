import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import History from "../pages/History";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../layout/Layout";
import LayoutAdmin from "../layout/LayoutAdmin";
import Deshboard from "../pages/admin/Deshboard";
import Category from "../pages/admin/Category";
import Product from "../pages/admin/Product";
import Manage from "../pages/admin/Manage";
import LayoutUser from "../layout/layoutUser";
import HomeUser from "../pages/userLogin/HomeUser";
import { ProtectRouteUser } from "./ProtectRouteUser";
import { ProtectRouteAdmin } from "./ProtectRouteAdmin";
import { EditProduct } from "../pages/admin/EditProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "cart", element: <Cart /> },
      { path: "history", element: <History /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />, // send props
    children: [
      { index: true, element: <Deshboard /> },
      { path: "category", element: <Category /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <EditProduct /> },
      { path: "manage", element: <Manage /> },
    ],
  },

  {
    path: "/user",
    element: <ProtectRouteUser element={<LayoutUser />} />, // send props
    children: [{ index: true, element: <HomeUser /> }],
  },
]);

export const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
