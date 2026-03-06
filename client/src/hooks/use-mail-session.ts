import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

type RealSession = { address: string; token: string };

const SESSION_SECONDS = 600;

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_SECONDS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const initRef = useRef(false);
  const creatingRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const createFreshSession = useCallback(async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;

    try {
      clearTimer();

      setCurrentEmail("");
      setToken("");
      setInbox([]);
      setTimeLeft(SESSION_SECONDS);
      setIsPaused(false);
      setIsExpired(false);

      const s = await createSession();

      setCurrentEmail(s.address);
      setToken(s.token);
      setInbox([]);
      setTimeLeft(SESSION_SECONDS);
      setIsPaused(false);
      setIsExpired(false);
    } catch (e) {
      console.error("CREATE SESSION ERROR:", e);
      setCurrentEmail("");
      setToken("");
      setInbox([]);
      setTimeLeft(0);
      setIsPaused(false);
      setIsExpired(true);
    } finally {
      creatingRef.current = false;
    }
  }, []);

  const expireSession = useCallback(async () => {
    clearTimer();

    setCurrentEmail("");
    setToken("");
    setInbox([]);
    setTimeLeft(0);
    setIsPaused(false);
    setIsExpired(true);

    // ✅ genera automáticamente un correo nuevo al expirar
    await createFreshSession();
  }, [createFreshSession]);

  // ✅ Cada vez que se abre la página/pestaña: correo nuevo e independiente
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    createFreshSession();

    return () => {
      clearTimer();
    };
  }, [createFreshSession]);

  // ✅ Timer independiente por pestaña
  useEffect(() => {
    clearTimer();

    if (!currentEmail) return;
    if (isPaused) return;
    if (isExpired) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [currentEmail, isPaused, isExpired]);

  // ✅ Cuando llega a 0: limpia y crea uno nuevo
  useEffect(() => {
    if (!currentEmail) return;
    if (isExpired) return;
    if (timeLeft !== 0) return;

    expireSession();
  }, [timeLeft, currentEmail, isExpired, expireSession]);

  // ✅ Polling inbox independiente por pestaña
  useEffect(() => {
    if (!token || isPaused || isExpired) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch(
          "https://tempmail-backend-production.up.railway.app/api/inbox",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const list =
          data?.messages ?? data?.["hydra:member"] ?? data?.data ?? [];

        if (!cancelled && Array.isArray(list)) {
          const mapped: EmailMessage[] = list.map((m: any) => ({
            id:
              m.id ??
              m["@id"] ??
              `${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  const setRealSession = useCallback((session: RealSession) => {
    clearTimer();

    setCurrentEmail(session.address);
    setToken(session.token);
    setInbox([]);
    setTimeLeft(SESSION_SECONDS);
    setIsPaused(false);
    setIsExpired(false);
  }, []);

  const handleReset = useCallback(async () => {
    await createFreshSession();
  }, [createFreshSession]);

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
  };
};
