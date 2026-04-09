import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession, getInbox, clearInbox } from "@/lib/api";

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

      if (currentEmail) {
        try {
          await clearInbox(currentEmail);
        } catch (e) {
          console.error("CLEAR OLD INBOX ERROR:", e);
        }
      }

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
  }, [currentEmail]);

  const expireSession = useCallback(async () => {
    clearTimer();

    if (currentEmail) {
      try {
        await clearInbox(currentEmail);
      } catch (e) {
        console.error("CLEAR EXPIRED INBOX ERROR:", e);
      }
    }

    setCurrentEmail("");
    setToken("");
    setInbox([]);
    setTimeLeft(0);
    setIsPaused(false);
    setIsExpired(true);

    await createFreshSession();
  }, [createFreshSession, currentEmail]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    createFreshSession();

    return () => {
      clearTimer();
    };
  }, [createFreshSession]);

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

  useEffect(() => {
    if (!currentEmail) return;
    if (isExpired) return;
    if (timeLeft !== 0) return;

    expireSession();
  }, [timeLeft, currentEmail, isExpired, expireSession]);

  useEffect(() => {
    if (!currentEmail || isPaused || isExpired) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const list = await getInbox(currentEmail);

        if (!cancelled && Array.isArray(list)) {
          const mapped: EmailMessage[] = list.map((m: any) => ({
            id:
              m.id ??
              `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            sender: m?.from ?? "unknown",
            subject: m?.subject ?? "(no subject)",
            preview: m?.body ? String(m.body).slice(0, 120) : "",
            body: m?.body ?? "",
            timestamp: m?.date ? new Date(m.date) : new Date(),
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
  }, [currentEmail, isPaused, isExpired]);

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