import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

type SavedSession = {
  currentEmail?: string;
  token?: string;
  inbox?: EmailMessage[];
  timeLeft?: number;
  isPaused?: boolean;
  lastSaved?: number;
};

const STORAGE_KEY = "quantum_session";
const SESSION_SECONDS = 600; // 10 min

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_SECONDS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const persist = useCallback(
    (next?: Partial<SavedSession>) => {
      try {
        const payload: SavedSession = {
          currentEmail,
          token,
          inbox,
          timeLeft,
          isPaused,
          lastSaved: Date.now(),
          ...next,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore
      }
    },
    [currentEmail, token, inbox, timeLeft, isPaused]
  );

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setCurrentEmail("");
    setToken("");
    setInbox([]);
    setIsPaused(false);
    setTimeLeft(0);
    setIsExpired(true);
  }, []);

  const startNewSession = useCallback(async () => {
    try {
      const s = await createSession();

      setCurrentEmail(s.address);
      setToken(s.token);
      setInbox([]);
      setTimeLeft(SESSION_SECONDS);
      setIsPaused(false);
      setIsExpired(false);

      persist({
        currentEmail: s.address,
        token: s.token,
        inbox: [],
        timeLeft: SESSION_SECONDS,
        isPaused: false,
        lastSaved: Date.now(),
      });
    } catch (e) {
      console.error("CREATE SESSION ERROR:", e);
      // si falla, deja en estado expirado para obligar NEW cuando vuelva a haber backend
      clearSession();
    }
  }, [persist, clearSession]);

  // ✅ Init: intenta restaurar. Si estaba expirada -> exige NEW.
  useEffect(() => {
    let savedRaw: string | null = null;
    try {
      savedRaw = localStorage.getItem(STORAGE_KEY);
    } catch {
      savedRaw = null;
    }

    if (!savedRaw) {
      // primera visita -> crea una nueva automáticamente (como pediste)
      startNewSession();
      return;
    }

    try {
      const parsed = JSON.parse(savedRaw) as SavedSession;

      const savedEmail = parsed.currentEmail || "";
      const savedToken = parsed.token || "";
      const savedInbox = parsed.inbox || [];
      const savedTime = typeof parsed.timeLeft === "number" ? parsed.timeLeft : SESSION_SECONDS;
      const savedPaused = !!parsed.isPaused;
      const savedAt = typeof parsed.lastSaved === "number" ? parsed.lastSaved : Date.now();

      // calcula tiempo restante real si no estaba pausado
      const elapsed = Math.floor((Date.now() - savedAt) / 1000);
      const computed = savedPaused ? savedTime : savedTime - elapsed;

      if (!savedEmail || !savedToken || computed <= 0) {
        // estaba muerto -> NO creamos nuevo automático, exigimos NEW
        clearSession();
        return;
      }

      setCurrentEmail(savedEmail);
      setToken(savedToken);
      setInbox(savedInbox);
      setTimeLeft(computed);
      setIsPaused(savedPaused);
      setIsExpired(false);
    } catch (e) {
      console.error("SESSION PARSE ERROR:", e);
      clearSession();
    }
  }, [startNewSession, clearSession]);

  // ✅ Persist (solo si hay sesión viva)
  useEffect(() => {
    if (!currentEmail || isExpired) return;
    persist();
  }, [currentEmail, token, inbox, timeLeft, isPaused, isExpired, persist]);

  // ✅ Timer (sin llamar reset dentro del setState)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isExpired || isPaused || !currentEmail || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExpired, isPaused, currentEmail, timeLeft]);

  // ✅ Cuando llegue a 0 => expira y obliga NEW
  useEffect(() => {
    if (!isExpired && currentEmail && timeLeft === 0) {
      clearSession();
    }
  }, [timeLeft, isExpired, currentEmail, clearSession]);

  // ✅ Polling Inbox REAL (solo si sesión viva)
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

  // ✅ NEW button (crea sesión real)
  const handleReset = useCallback(async () => {
    try {
      // limpia primero
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setInbox([]);
      setToken("");
      setIsPaused(false);
      setTimeLeft(SESSION_SECONDS);
      setIsExpired(false);

      const s = await createSession();
      setCurrentEmail(s.address);
      setToken(s.token);

      persist({
        currentEmail: s.address,
        token: s.token,
        inbox: [],
        timeLeft: SESSION_SECONDS,
        isPaused: false,
        lastSaved: Date.now(),
      });
    } catch (e) {
      console.error("RESET ERROR:", e);
      clearSession();
    }
  }, [persist, clearSession]);

  const setRealSession = useCallback(
    (session: { address: string; token: string }) => {
      setCurrentEmail(session.address);
      setToken(session.token);
      setInbox([]);
      setTimeLeft(SESSION_SECONDS);
      setIsPaused(false);
      setIsExpired(false);

      persist({
        currentEmail: session.address,
        token: session.token,
        inbox: [],
        timeLeft: SESSION_SECONDS,
        isPaused: false,
        lastSaved: Date.now(),
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
