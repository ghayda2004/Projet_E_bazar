

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./src/components/ErrorBoundary.tsx";
import "./index.css";

console.log("Main.tsx is loading...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, rendering App...");
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log("App rendered successfully!");
  } catch (error) {
    console.error("Error rendering App:", error);
  }
}

