import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registrarTrabajador } from "./pwa/registrar.js";
import "./estilos/app.css";

registrarTrabajador();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
