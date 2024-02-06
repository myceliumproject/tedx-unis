import MainLayout from "$/layouts/MainLayout";
import Auth from "$/pages/Auth";
import BlockInfo from "$/pages/BlockInfo";
import ChangeName from "$/pages/ChangeName";
import Creditos from "$/pages/Credits";
import Home from "$/pages/Home";
import type { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";
// Staff
import Attendance from "$/pages/staff/Attendance";
import ListaBloques from "$/pages/staff/ListaBloques";
import TicketValidation from "$/pages/staff/TicketValidation";
import Users from "$/pages/staff/Users";

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
        path: "changename",
        element: <ChangeName />,
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
        path: "attendance/:id",
        element: <Attendance />,
      },
      {
        path: "ticket",
        element: <TicketValidation />,
      },
      {
        path: "users",
        element: <Users />,
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
