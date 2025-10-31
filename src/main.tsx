import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap";
import "./Styles/index.css";
import App from "./Componentes/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
