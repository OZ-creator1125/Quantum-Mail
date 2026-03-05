import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * ✅ Paso B: Captura errores globales (producción + promesas)
 * Guarda el último crash en localStorage:
 * - qm_last_crash_global
 * - qm_last_crash_promise
 */
window.addEventListener("error", (e) => {
  try {
    const payload = {
      type: "window.error",
      message: (e as any)?.message ?? "Unknown window error",
      filename: (e as any)?.filename ?? "",
      lineno: (e as any)?.lineno ?? "",
      colno: (e as any)?.colno ?? "",
      stack: (e as any)?.error?.stack ?? "",
      time: new Date().toISOString(),
    };

    console.error("GLOBAL ERROR:", payload);
    localStorage.setItem("qm_last_crash_global", JSON.stringify(payload));
  } catch (err) {
    console.error("GLOBAL ERROR (logging failed):", err);
  }
});

window.addEventListener("unhandledrejection", (e: any) => {
  try {
    const reason = e?.reason;

    const payload = {
      type: "unhandledrejection",
      message:
        typeof reason === "string"
          ? reason
          : reason?.message ?? "Unhandled promise rejection",
      stack: reason?.stack ?? "",
      time: new Date().toISOString(),
    };

    console.error("UNHANDLED PROMISE:", payload);
    localStorage.setItem("qm_last_crash_promise", JSON.stringify(payload));
  } catch (err) {
    console.error("UNHANDLED PROMISE (logging failed):", err);
  }
});

/**
 * ✅ Paso A: “Crash Screen” (evita pantalla negra)
 * Si render() falla o React explota, mostramos un UI mínimo y logueamos.
 */
function renderCrashScreen(title: string, details?: any) {
  try {
    const root = document.getElementById("root");
    if (!root) return;

    const safeDetails =
      typeof details === "string"
        ? details
        : details?.message || JSON.stringify(details || {}, null, 2);

    const html = `
      <div style="
        min-height:100vh;
        padding:24px;
        display:flex;
        align-items:flex-start;
        justify-content:center;
        background:#05060a;
        color:#fff;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      ">
        <div style="
          width:min(920px, 100%);
          border:1px solid rgba(255,255,255,.12);
          background:rgba(0,0,0,.35);
          border-radius:16px;
          padding:18px;
          box-shadow: 0 10px 34px rgba(0,0,0,.6);
        ">
          <div style="font-weight:800; font-size:18px; letter-spacing:.02em;">
            ⚠️ Quantum Mail crashed (no more black screen)
          </div>
          <div style="margin-top:8px; color:rgba(255,255,255,.72);">
            ${title}
          </div>

          <div style="
            margin-top:14px;
            padding:12px;
            border-radius:12px;
            background:rgba(255, 70, 70, .08);
            border:1px solid rgba(255, 70, 70, .25);
            white-space:pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
            font-size:12px;
            line-height:1.5;
            color:rgba(255,255,255,.85);
          ">${safeDetails}</div>

          <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
            <button id="qm_reload" style="
              padding:10px 14px;
              border-radius:12px;
              border:1px solid rgba(255,255,255,.14);
              background:rgba(255,255,255,.06);
              color:#fff;
              cursor:pointer;
              font-weight:700;
            ">Reload</button>

            <button id="qm_clear" style="
              padding:10px 14px;
              border-radius:12px;
              border:1px solid rgba(0,255,200,.22);
              background:rgba(0,255,200,.06);
              color:rgba(0,255,200,.95);
              cursor:pointer;
              font-weight:700;
            ">Clear quantum_session + Reload</button>
          </div>

          <div style="margin-top:10px; color:rgba(255,255,255,.5); font-size:12px;">
            Debug: abre DevTools (F12) → Console. Último crash guardado en localStorage.
          </div>
        </div>
      </div>
    `;

    root.innerHTML = html;

    const btnReload = document.getElementById("qm_reload");
    btnReload?.addEventListener("click", () => window.location.reload());

    const btnClear = document.getElementById("qm_clear");
    btnClear?.addEventListener("click", () => {
      try {
        localStorage.removeItem("quantum_session");
      } catch {}
      window.location.reload();
    });
  } catch (e) {
    console.error("renderCrashScreen failed:", e);
  }
}

function safeRender() {
  const rootEl = document.getElementById("root");

  if (!rootEl) {
    renderCrashScreen("Missing #root element", "No <div id='root'></div> found.");
    return;
  }

  try {
    // Si quieres evitar dobles renders en DEV que a veces complican debugging:
    // usa <React.StrictMode> solo si te interesa.
    createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err: any) {
    console.error("RENDER ERROR:", err);
    try {
      localStorage.setItem(
        "qm_last_crash_render",
        JSON.stringify(
          {
            type: "render",
            message: err?.message ?? "Render crash",
            stack: err?.stack ?? "",
            time: new Date().toISOString(),
          },
          null,
          2
        )
      );
    } catch {}
    renderCrashScreen("Render crashed", err);
  }
}

safeRender();
