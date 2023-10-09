import MainLayout from "$/layouts/MainLayout";
import Auth from "$/pages/Auth";
import BlockInfo from "$/pages/BlockInfo";
import Home from "$/pages/Home";
import type { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";
// Staff
import Creditos from "$/pages/Credits";
import ListaBloques from "$/pages/staff/ListaBloques";
import StaffLogin from "$/pages/staff/StaffLogin";
import StaffRegister from "$/pages/staff/StaffRegister";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/block/:id",
        element: <BlockInfo />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/by",
        element: <Creditos />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/staff",
    element: <MainLayout />,
    children: [
      {
        path: "/staff/",
        element: <ListaBloques />,
      },
      {
        path: "/staff/register",
        element: <StaffRegister />,
      },
      { path: "/staff/login", element: <StaffLogin /> },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
