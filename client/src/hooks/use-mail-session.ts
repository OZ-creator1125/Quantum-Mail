import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

type SavedSession = {
  currentEmail: string;
  token: string;
  inbox: EmailMessage[];
  timeLeft: number;
  isPaused: boolean;
  lastSaved: number;
};

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const persist = useCallback(
    (partial?: Partial<SavedSession>) => {
      if (!currentEmail && !(partial?.currentEmail ?? "")) return;

      const payload: SavedSession = {
        currentEmail: partial?.currentEmail ?? currentEmail,
        token: partial?.token ?? token,
        inbox: partial?.inbox ?? inbox,
        timeLeft: partial?.timeLeft ?? timeLeft,
        isPaused: partial?.isPaused ?? isPaused,
        lastSaved: Date.now(),
      };

      localStorage.setItem("quantum_session", JSON.stringify(payload));
    },
    [currentEmail, token, inbox, timeLeft, isPaused]
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem("quantum_session");
    setInbox([]);
    setToken("");
    setCurrentEmail("");
    setIsPaused(false);
    setTimeLeft(0);
    setIsExpired(true);
  }, []);

  // ✅ NEW button action: create fresh session and start timer
  const handleReset = useCallback(async () => {
    try {
      localStorage.removeItem("quantum_session");

      setInbox([]);
      setToken("");
      setCurrentEmail("");
      setIsPaused(false);
      setTimeLeft(600);
      setIsExpired(false);

      const s = await createSession();

      setCurrentEmail(s.address);
      setToken(s.token);
      setInbox([]);
      setTimeLeft(600);
      setIsPaused(false);
      setIsExpired(false);

      persist({
        currentEmail: s.address,
        token: s.token,
        inbox: [],
        timeLeft: 600,
        isPaused: false,
      });
    } catch (e) {
      console.error("RESET ERROR:", e);
    }
  }, [persist]);

  // ✅ Init: load saved session or create one automatically
  useEffect(() => {
    const saved = localStorage.getItem("quantum_session");

    if (saved) {
      try {
        const parsed: SavedSession = JSON.parse(saved);

        const elapsed = Math.floor((Date.now() - (parsed.lastSaved || Date.now())) / 1000);
        const newTime = parsed.isPaused ? parsed.timeLeft : parsed.timeLeft - elapsed;

        // If expired while tab was closed -> require NEW (do NOT auto-generate)
        if (newTime <= 0) {
          clearSession();
          return;
        }

        setCurrentEmail(parsed.currentEmail || "");
        setToken(parsed.token || "");
        setInbox(parsed.inbox || []);
        setTimeLeft(newTime);
        setIsPaused(!!parsed.isPaused);
        setIsExpired(false);
        return;
      } catch (e) {
        console.error("SESSION PARSE ERROR:", e);
        localStorage.removeItem("quantum_session");
      }
    }

    // No saved session -> create automatically
    (async () => {
      try {
        const s = await createSession();
        setCurrentEmail(s.address);
        setToken(s.token);
        setInbox([]);
        setTimeLeft(600);
        setIsPaused(false);
        setIsExpired(false);

        persist({
          currentEmail: s.address,
          token: s.token,
          inbox: [],
          timeLeft: 600,
          isPaused: false,
        });
      } catch (e) {
        console.error("INIT CREATE SESSION ERROR:", e);
      }
    })();
  }, [persist, clearSession]);

  // ✅ Persist changes (only if not expired)
  useEffect(() => {
    if (isExpired) return;
    if (!currentEmail) return;
    persist();
  }, [currentEmail, token, inbox, timeLeft, isPaused, isExpired, persist]);

  // ✅ Timer: last minute warning handled in UI; at 0 -> wipe and require NEW
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isExpired) return;
    if (isPaused || !currentEmail || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Expire NOW: clear everything and require NEW
          clearSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentEmail, timeLeft, isExpired, clearSession]);

  // ✅ Polling Inbox REAL (disabled if expired)
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
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [token, isPaused, isExpired]);

  const togglePause = () => setIsPaused((p) => !p);

  // ✅ If Home creates a real new session manually (rare case), keep support
  const setRealSession = useCallback(
    (session: { address: string; token: string }) => {
      setCurrentEmail(session.address);
      setToken(session.token);
      setInbox([]);
      setTimeLeft(600);
      setIsPaused(false);
      setIsExpired(false);

      persist({
        currentEmail: session.address,
        token: session.token,
        inbox: [],
        timeLeft: 600,
        isPaused: false,
      });
    },
    [persist]
  );

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
