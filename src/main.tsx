import React from "react";
import { createRoot } from "react-dom/client";
import { LDProvider } from "launchdarkly-react-client-sdk";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}

const clientSideId = import.meta.env.VITE_LD_CLIENT_SIDE_ID ?? "";

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <LDProvider clientSideID={clientSideId} user={{ key: "anonymous" }}>
      <App />
    </LDProvider>
  </React.StrictMode>
);
