import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css"

import * as bootstrap from 'bootstrap'
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth-context.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
