import React from "react";

type State = { hasError: boolean; error?: any; info?: any };

export class CrashScreen extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // log a consola
    console.error("APP CRASH:", error, info);

    // intenta guardar para que lo veas aunque se recargue
    try {
      localStorage.setItem(
        "qm_last_crash",
        JSON.stringify({
          message: String(error?.message ?? error),
          stack: String(error?.stack ?? ""),
          time: new Date().toISOString(),
        })
      );
    } catch {}
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message =
      this.state.error?.message ??
      (typeof this.state.error === "string" ? this.state.error : "Unknown error");

    const stack = this.state.error?.stack ?? "";

    return (
      <div style={{ minHeight: "100vh", padding: 24, background: "#000", color: "#fff" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>Quantum Mail crashed</h1>
          <p style={{ opacity: 0.8, marginBottom: 16 }}>
            Copia esto y pégamelo aquí. Con esto lo arreglamos en 1 tiro.
          </p>

          <div style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: 14 }}>
            <div style={{ marginBottom: 10, opacity: 0.9 }}><b>Error:</b> {message}</div>
            <pre style={{ whiteSpace: "pre-wrap", opacity: 0.75, fontSize: 12, lineHeight: 1.4 }}>
{stack}
            </pre>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={() => location.reload()}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Reload
            </button>

            <button
              onClick={() => {
                try { localStorage.removeItem("quantum_session"); } catch {}
                try { localStorage.removeItem("qm_last_crash"); } catch {}
                location.reload();
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,80,80,0.35)",
                background: "rgba(255,80,80,0.10)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Clear session + Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
