import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import App from "./App.jsx";
import "./styles/index.css";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <App />
        </APIProvider>
      ) : (
        <App />
      )}
    </StrictMode>
  );
}
