import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Init: carga sesión sin historial
  useEffect(() => {
    const saved = localStorage.getItem("quantum_session");

    if (saved) {
      const parsed = JSON.parse(saved);

      setCurrentEmail(parsed.currentEmail || "");
      setToken(parsed.token || "");
      setInbox(parsed.inbox || []);

      const elapsed = Math.floor((Date.now() - (parsed.lastSaved || Date.now())) / 1000);
      const newTime = parsed.isPaused ? parsed.timeLeft : (parsed.timeLeft - elapsed);

      if (newTime <= 0) {
        // si expiró, fuerza reset
        setTimeLeft(0);
      } else {
        setTimeLeft(newTime);
        setIsPaused(!!parsed.isPaused);
      }
      return;
    }

    // si no hay sesión guardada, crea una nueva REAL
    (async () => {
      const s = await createSession();
      setCurrentEmail(s.address);
      setToken(s.token);
      setInbox([]);
      setTimeLeft(600);
      setIsPaused(false);

      localStorage.setItem(
        "quantum_session",
        JSON.stringify({
          currentEmail: s.address,
          token: s.token,
          inbox: [],
          timeLeft: 600,
          isPaused: false,
          lastSaved: Date.now(),
        })
      );
    })();
  }, []);

  // ✅ Persist (sin historial siempre)
  useEffect(() => {
    if (!currentEmail) return;

    localStorage.setItem(
      "quantum_session",
      JSON.stringify({
        currentEmail,
        token,
        inbox,
        timeLeft,
        isPaused,
        lastSaved: Date.now(),
      })
    );
  }, [currentEmail, token, inbox, timeLeft, isPaused]);

  // ✅ Reset: nuevo correo real + limpia inbox
  const handleReset = useCallback(async () => {
    try {
      localStorage.removeItem("quantum_session");

      setInbox([]);
      setToken("");
      setIsPaused(false);
      setTimeLeft(600);

      const s = await createSession();
      setCurrentEmail(s.address);
      setToken(s.token);

      localStorage.setItem(
        "quantum_session",
        JSON.stringify({
          currentEmail: s.address,
          token: s.token,
          inbox: [],
          timeLeft: 600,
          isPaused: false,
          lastSaved: Date.now(),
        })
      );
    } catch (e) {
      console.error("RESET ERROR:", e);
    }
  }, []);

  // ✅ Timer: si llega a 0, resetea
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPaused || !currentEmail || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentEmail, timeLeft, handleReset]);

  // ✅ Polling Inbox REAL
  useEffect(() => {
    if (!token || isPaused) return;

    const tick = async () => {
      try {
        const res = await fetch(
          "https://tempmail-backend-production.up.railway.app/api/inbox",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        const list = data?.messages ?? data?.["hydra:member"] ?? data?.data ?? [];

        if (Array.isArray(list)) {
          const mapped = list.map((m: any) => ({
            id: m.id ?? m["@id"] ?? crypto.randomUUID(),
            sender: m?.from?.address ?? "unknown",
            subject: m?.subject ?? "(no subject)",
            preview: m?.intro ?? "",
            body: m?.intro ?? "",
            timestamp: m?.createdAt ? new Date(m.createdAt) : new Date(),
          }));

          setInbox(mapped);
        }
      } catch (err) {
        console.error("INBOX ERROR:", err);
      }
    };

    tick();
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [token, isPaused]);

  const togglePause = () => setIsPaused((p) => !p);
  const addExtraTime = () => setTimeLeft(600);

  // ✅ New session desde Home (NEW button)
  const setRealSession = useCallback((session: { address: string; token: string }) => {
    setCurrentEmail(session.address);
    setToken(session.token);
    setInbox([]);
    setTimeLeft(600);
    setIsPaused(false);

    localStorage.setItem(
      "quantum_session",
      JSON.stringify({
        currentEmail: session.address,
        token: session.token,
        inbox: [],
        timeLeft: 600,
        isPaused: false,
        lastSaved: Date.now(),
      })
    );
  }, []);

  return {
    currentEmail,
    token,
    inbox,
    timeLeft,
    isPaused,
    togglePause,
    handleReset,
    addExtraTime,
    setRealSession,
  };
};
