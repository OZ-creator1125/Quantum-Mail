import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

type RealSession = { address: string; token: string };

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // ✅ When expired, we clear everything and require NEW to start again
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const initOnceRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const expireSession = useCallback(() => {
    // Stop everything and require NEW
    clearTimer();
    setIsPaused(false);
    setIsExpired(true);

    setInbox([]);
    setToken("");
    setCurrentEmail("");
    setTimeLeft(0);

    try {
      localStorage.removeItem("quantum_session");
    } catch {}
  }, []);

  const startNewSession = useCallback(async () => {
    clearTimer();
    setIsPaused(false);
    setIsExpired(false);
    setInbox([]);
    setTimeLeft(600);

    const s = await createSession();
    setCurrentEmail(s.address);
    setToken(s.token);

    try {
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
    } catch {}
  }, []);

  // ✅ INIT: always create a new session on first load (like 10minutemail)
  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;

    (async () => {
      try {
        await startNewSession();
      } catch (e) {
        console.error("INIT SESSION ERROR:", e);
        // If backend fails, keep app usable (no crash / no black screen)
        setIsExpired(true);
        setCurrentEmail("");
        setToken("");
        setInbox([]);
        setTimeLeft(0);
      }
    })();

    return () => clearTimer();
  }, [startNewSession]);

  // ✅ PERSIST (safe, but not required)
  useEffect(() => {
    if (!currentEmail && !token) return;

    try {
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
    } catch {}
  }, [currentEmail, token, inbox, timeLeft, isPaused]);

  // ✅ TIMER (NO dependency on timeLeft -> avoids React #185 loops)
  useEffect(() => {
    clearTimer();

    if (isExpired) return;
    if (!currentEmail) return;
    if (isPaused) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [currentEmail, isPaused, isExpired]);

  // ✅ When it reaches 0, expire (requires NEW)
  useEffect(() => {
    if (isExpired) return;
    if (!currentEmail) return;
    if (timeLeft !== 0) return;

    expireSession();
  }, [timeLeft, expireSession, isExpired, currentEmail]);

  // ✅ Polling inbox REAL (stops when expired or missing token)
  useEffect(() => {
    if (isExpired) return;
    if (!token) return;
    if (isPaused) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch(
          "https://tempmail-backend-production.up.railway.app/api/inbox",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        const list =
          data?.messages ?? data?.["hydra:member"] ?? data?.data ?? [];

        if (!cancelled && Array.isArray(list)) {
          const mapped: EmailMessage[] = list.map((m: any) => ({
            id: m.id ?? m["@id"] ?? crypto.randomUUID(),
            sender: m?.from?.address ?? "unknown",
            subject: m?.subject ?? "(no subject)",
            preview: m?.intro ?? "",
            body: m?.text ?? m?.html ?? m?.intro ?? "",
            timestamp: m?.createdAt ? new Date(m.createdAt) : new Date(),
          }));

          setInbox(mapped);
        }
      } catch (err) {
        console.error("INBOX ERROR:", err);
      }
    };

    tick();
    const interval = window.setInterval(tick, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [token, isPaused, isExpired]);

  const togglePause = () => setIsPaused((p) => !p);

  // NEW button uses this
  const setRealSession = useCallback((session: RealSession) => {
    clearTimer();
    setIsPaused(false);
    setIsExpired(false);

    setCurrentEmail(session.address);
    setToken(session.token);
    setInbox([]);
    setTimeLeft(600);

    try {
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
    } catch {}
  }, []);

  // If you still want a reset function:
  const handleReset = useCallback(async () => {
    await startNewSession();
  }, [startNewSession]);

  return {
    currentEmail,
    token,
    inbox,
    timeLeft,
    isPaused,
    isExpired,

    togglePause,
    handleReset,
    setRealSession,
    expireSession, // optional (not required)
  };
};
