import "@fontsource/montserrat/300-italic.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400-italic.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700-italic.css";
import "@fontsource/montserrat/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.scss";
import routes from "./routes";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
