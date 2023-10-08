import MainLayout from "$/layouts/MainLayout";
import BlockInfo from "$/pages/BlockInfo";
import Home from "$/pages/Home";
import type { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";

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
