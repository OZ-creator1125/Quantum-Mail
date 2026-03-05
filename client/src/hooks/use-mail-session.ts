import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const pollingRef = useRef<number | null>(null);

  const isExpired = useMemo(() => timeLeft <= 0 || !currentEmail, [timeLeft, currentEmail]);
  const isExpiring = useMemo(() => timeLeft > 0 && timeLeft <= 60, [timeLeft]);

  const clearTimers = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (pollingRef.current) window.clearInterval(pollingRef.current);
    timerRef.current = null;
    pollingRef.current = null;
  };

  const expireSession = useCallback(() => {
    clearTimers();
    setInbox([]);
    setToken("");
    setCurrentEmail("");
    setTimeLeft(0);
    setIsPaused(false);
  }, []);

  const startNewSession = useCallback(async () => {
    clearTimers();

    // Estado “limpio”
    setInbox([]);
    setToken("");
    setCurrentEmail("");
    setTimeLeft(600);
    setIsPaused(false);

    const s = await createSession();
    setCurrentEmail(s.address);
    setToken(s.token);
    setInbox([]);
    setTimeLeft(600);
    setIsPaused(false);

    // Arranca timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // expira (y obliga a NEW)
          expireSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [expireSession]);

  // ✅ INIT: SIEMPRE crea un correo nuevo al abrir la página
  useEffect(() => {
    startNewSession();

    // Si cierran la pestaña, no guardamos nada: al volver abrir, siempre NEW.
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Polling inbox (solo si hay token + no pausado + no expirado)
  useEffect(() => {
    if (!token || isPaused || isExpired) return;

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
    pollingRef.current = window.setInterval(tick, 4000);

    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    };
  }, [token, isPaused, isExpired]);

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  // ✅ NEW button: crea sesión nueva real
  const handleReset = useCallback(async () => {
    await startNewSession();
  }, [startNewSession]);

  // ✅ compat: Home ya usa setRealSession (lo dejamos)
  const setRealSession = useCallback(
    (session: { address: string; token: string }) => {
      clearTimers();

      setCurrentEmail(session.address);
      setToken(session.token);
      setInbox([]);
      setTimeLeft(600);
      setIsPaused(false);

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            expireSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [expireSession]
  );

  return {
    currentEmail,
    token,
    inbox,
    timeLeft,
    isPaused,
    togglePause,
    handleReset,
    setRealSession,
    isExpiring,
    isExpired,
  };
};
