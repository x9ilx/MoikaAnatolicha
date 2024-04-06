import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "./scss/styles.scss";
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/dist/js/bootstrap.esm.js"
import "bootstrap/dist/js/bootstrap.bundle.js"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);
