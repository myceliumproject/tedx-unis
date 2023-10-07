import Home from "$/pages/Home";
import type { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
