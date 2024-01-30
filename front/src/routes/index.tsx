import MainLayout from "$/layouts/MainLayout";
import Auth from "$/pages/Auth";
import BlockInfo from "$/pages/BlockInfo";
import Home from "$/pages/Home";
import type { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";
// Staff
import Creditos from "$/pages/Credits";
import Attendance from "$/pages/staff/Attendance";
import ListaBloques from "$/pages/staff/ListaBloques";
import StaffLogin from "$/pages/staff/StaffLogin";
import StaffRegister from "$/pages/staff/StaffRegister";
import TicketValidation from "$/pages/staff/TicketValidation";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "block/:id",
        element: <BlockInfo />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "by",
        element: <Creditos />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "staff",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <ListaBloques />,
      },
      {
        path: "register",
        element: <StaffRegister />,
      },
      { path: "login", element: <StaffLogin /> },
      {
        path: "attendance/:id",
        element: <Attendance />,
      },
      {
        path: "ticket",
        element: <TicketValidation />,
      },
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
