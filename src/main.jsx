import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { PortfolioProvider } from "./context/PortfolioContext";
import App from "./App";
import "./App.css";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PortfolioProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </PortfolioProvider>
  </React.StrictMode>
);
