import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function BootTest() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        fontSize: "28px",
      }}
    >
      QUANTUM BOOT TEST
    </div>
  );
}

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML =
    '<div style="padding:20px;color:red">Missing #root</div>';
} else {
  createRoot(rootEl).render(
    <React.StrictMode>
      <BootTest />
    </React.StrictMode>
  );
}