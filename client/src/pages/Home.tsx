import { useMemo, useState } from "react";
import { useMailSession } from "@/hooks/use-mail-session";
import { createSession } from "@/lib/api";

// 👉 reemplazos simples para evitar crashes
const Button = (props: any) => (
  <button
    {...props}
    style={{
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "#111",
      color: "#fff",
      cursor: "pointer",
      marginLeft: "8px",
    }}
  />
);

export default function Home() {
  const {
    currentEmail,
    inbox,
    timeLeft,
    isPaused,
    isExpired,
    togglePause,
    setRealSession,
  } = useMailSession();

  const [copied, setCopied] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const timeText = useMemo(() => formatTime(timeLeft), [timeLeft]);

  const handleNew = async () => {
    const s = await createSession();

    await navigator.clipboard.writeText(s.address);

    setRealSession({ address: s.address, token: s.token });
  };

  const handleCopy = async () => {
    if (!currentEmail) return;

    await navigator.clipboard.writeText(currentEmail);

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060a",
        color: "#fff",
        padding: "20px",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        QUANTUM MAIL
      </h1>

      {/* EMAIL */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>EMAIL:</div>

        <div
          style={{
            padding: "12px",
            background: "#111",
            borderRadius: "8px",
          }}
        >
          {currentEmail || "GENERATING..."}
        </div>

        <div style={{ marginTop: "10px" }}>
          <Button onClick={handleCopy}>
            {copied ? "COPIED" : "COPY"}
          </Button>

          <Button onClick={handleNew}>NEW</Button>
        </div>
      </div>

      {/* TIMER */}
      <div style={{ marginBottom: "20px" }}>
        <div>TIME:</div>
        <div style={{ fontSize: "24px" }}>{timeText}</div>

        <Button onClick={togglePause}>
          {isPaused ? "RESUME" : "PAUSE"}
        </Button>
      </div>

      {/* STATUS */}
      {isExpired && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          SESSION EXPIRED
        </div>
      )}

      {/* INBOX */}
      <div>
        <h2>INBOX ({inbox.length})</h2>

        {inbox.length === 0 && (
          <div style={{ opacity: 0.6 }}>Waiting emails...</div>
        )}

        {inbox.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #222",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {msg.subject}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              {msg.sender}
            </div>
            <div>{msg.preview}</div>
          </div>
        ))}
      </div>
    </div>
  );
}