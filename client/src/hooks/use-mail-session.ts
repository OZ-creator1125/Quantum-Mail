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
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const initOnceRef = useRef(false);
  const creatingRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const saveSession = useCallback(
    (address: string, tk: string, messages: EmailMessage[] = [], seconds = 600, paused = false) => {
      try {
        localStorage.setItem(
          "quantum_session",
          JSON.stringify({
            currentEmail: address,
            token: tk,
            inbox: messages,
            timeLeft: seconds,
            isPaused: paused,
            lastSaved: Date.now(),
          })
        );
      } catch {}
    },
    []
  );

  const clearSessionStorage = () => {
    try {
      localStorage.removeItem("quantum_session");
    } catch {}
  };

  const createFreshSession = useCallback(async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;

    try {
      clearTimer();
      setIsPaused(false);
      setIsExpired(false);
      setInbox([]);
      setCurrentEmail("");
      setToken("");
      setTimeLeft(600);

      const s = await createSession();

      setCurrentEmail(s.address);
      setToken(s.token);
      setInbox([]);
      setTimeLeft(600);
      setIsPaused(false);
      setIsExpired(false);

      saveSession(s.address, s.token, [], 600, false);
    } catch (e) {
      console.error("CREATE SESSION ERROR:", e);
      setCurrentEmail("");
      setToken("");
      setInbox([]);
      setTimeLeft(0);
      setIsPaused(false);
      setIsExpired(true);
      clearSessionStorage();
    } finally {
      creatingRef.current = false;
    }
  }, [saveSession]);

  const expireSession = useCallback(async () => {
    clearTimer();
    setIsPaused(false);
    setIsExpired(true);
    setInbox([]);
    setToken("");
    setCurrentEmail("");
    setTimeLeft(0);
    clearSessionStorage();

    // ✅ generar automáticamente uno nuevo al expirar
    await createFreshSession();
  }, [createFreshSession]);

  // ✅ INIT: al abrir la página siempre intenta restaurar si existe y sigue viva;
  // si no existe o ya expiró, crea un correo nuevo automáticamente
  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;

    const boot = async () => {
      try {
        const saved = localStorage.getItem("quantum_session");

        if (!saved) {
          await createFreshSession();
          return;
        }

        const parsed = JSON.parse(saved);

        const savedEmail = parsed?.currentEmail || "";
        const savedToken = parsed?.token || "";
        const savedInbox = Array.isArray(parsed?.inbox) ? parsed.inbox : [];
        const savedTime = typeof parsed?.timeLeft === "number" ? parsed.timeLeft : 600;
        const savedPaused = !!parsed?.isPaused;
        const savedAt = typeof parsed?.lastSaved === "number" ? parsed.lastSaved : Date.now();

        const elapsed = Math.floor((Date.now() - savedAt) / 1000);
        const computedTime = savedPaused ? savedTime : savedTime - elapsed;

        if (!savedEmail || !savedToken || computedTime <= 0) {
          clearSessionStorage();
          await createFreshSession();
          return;
        }

        setCurrentEmail(savedEmail);
        setToken(savedToken);
        setInbox(savedInbox);
        setTimeLeft(computedTime);
        setIsPaused(savedPaused);
        setIsExpired(false);
      } catch (e) {
        console.error("SESSION RESTORE ERROR:", e);
        clearSessionStorage();
        await createFreshSession();
      }
    };

    boot();

    return () => clearTimer();
  }, [createFreshSession]);

  // ✅ persistir sesión viva
  useEffect(() => {
    if (!currentEmail || !token) return;
    saveSession(currentEmail, token, inbox, timeLeft, isPaused);
  }, [currentEmail, token, inbox, timeLeft, isPaused, saveSession]);

  // ✅ timer
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

  // ✅ cuando llegue a 0, expira y crea otro automáticamente
  useEffect(() => {
    if (!currentEmail) return;
    if (isExpired) return;
    if (timeLeft !== 0) return;

    expireSession();
  }, [timeLeft, currentEmail, isExpired, expireSession]);

  // ✅ polling inbox
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
        const list = data?.messages ?? data?.["hydra:member"] ?? data?.data ?? [];

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

  const setRealSession = useCallback(
    (session: RealSession) => {
      clearTimer();
      setIsPaused(false);
      setIsExpired(false);
      setCurrentEmail(session.address);
      setToken(session.token);
      setInbox([]);
      setTimeLeft(600);

      saveSession(session.address, session.token, [], 600, false);
    },
    [saveSession]
  );

  const handleReset = useCallback(async () => {
    clearSessionStorage();
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
