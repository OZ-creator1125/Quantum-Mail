import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

const SESSION_KEY = "quantum_session";
const SESSION_SECONDS = 600;

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_SECONDS);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resettingRef = useRef(false);

  // ✅ Flags para UI (último minuto)
  const isExpiring = useMemo(() => !isPaused && timeLeft > 0 && timeLeft <= 60, [isPaused, timeLeft]);
  const isExpired = useMemo(() => timeLeft <= 0, [timeLeft]);

  const persist = useCallback(
    (next?: Partial<{ currentEmail: string; token: string; inbox: EmailMessage[]; timeLeft: number; isPaused: boolean }>) => {
      const payload = {
        currentEmail,
        token,
        inbox,
        timeLeft,
        isPaused,
        lastSaved: Date.now(),
        ...(next ?? {}),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    },
    [currentEmail, token, inbox, timeLeft, isPaused]
  );

  const hardSetSession = useCallback(
    (session: { address: string; token: string }) => {
      setCurrentEmail(session.address);
      setToken(session.token);
      setInbox([]);
      setTimeLeft(SESSION_SECONDS);
      setIsPaused(false);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          currentEmail: session.address,
          token: session.token,
          inbox: [],
          timeLeft: SESSION_SECONDS,
          isPaused: false,
          lastSaved: Date.now(),
        })
      );
    },
    []
  );

  // ✅ Reset: nuevo correo real + limpia inbox (y evita doble reset)
  const handleReset = useCallback(async () => {
    if (resettingRef.current) return;
    resettingRef.current = true;

    try {
      localStorage.removeItem(SESSION_KEY);

      setInbox([]);
      setToken("");
      setIsPaused(false);
      setTimeLeft(SESSION_SECONDS);

      const s = await createSession();
      setCurrentEmail(s.address);
      setToken(s.token);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          currentEmail: s.address,
          token: s.token,
          inbox: [],
          timeLeft: SESSION_SECONDS,
          isPaused: false,
          lastSaved: Date.now(),
        })
      );
    } catch (e) {
      console.error("RESET ERROR:", e);
    } finally {
      resettingRef.current = false;
    }
  }, []);

  // ✅ Init: carga sesión o crea una nueva
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const savedEmail = parsed.currentEmail || "";
        const savedToken = parsed.token || "";
        const savedInbox = parsed.inbox || [];
        const savedTimeLeft = typeof parsed.timeLeft === "number" ? parsed.timeLeft : SESSION_SECONDS;
        const savedPaused = !!parsed.isPaused;
        const lastSaved = parsed.lastSaved || Date.now();

        setCurrentEmail(savedEmail);
        setToken(savedToken);
        setInbox(savedInbox);
        setIsPaused(savedPaused);

        const elapsed = Math.floor((Date.now() - lastSaved) / 1000);
        const nextTime = savedPaused ? savedTimeLeft : savedTimeLeft - elapsed;

        if (nextTime <= 0) {
          // Expiró: genera nueva sesión automáticamente
          handleReset();
        } else {
          setTimeLeft(nextTime);
        }
        return;
      } catch (e) {
        console.error("SESSION PARSE ERROR:", e);
        localStorage.removeItem(SESSION_KEY);
      }
    }

    // No hay sesión guardada: crea una nueva REAL
    (async () => {
      try {
        const s = await createSession();
        hardSetSession({ address: s.address, token: s.token });
      } catch (e) {
        console.error("INIT CREATE SESSION ERROR:", e);
      }
    })();
  }, [handleReset, hardSetSession]);

  // ✅ Persist (siempre)
  useEffect(() => {
    if (!currentEmail) return;
    persist();
  }, [currentEmail, token, inbox, timeLeft, isPaused, persist]);

  // ✅ Timer: si llega a 0, resetea automáticamente
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!currentEmail || isPaused || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Al expirar: borra todo y crea nuevo
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

  // ✅ New session desde Home (NEW button)
  const setRealSession = useCallback((session: { address: string; token: string }) => {
    hardSetSession(session);
  }, [hardSetSession]);

  return {
    currentEmail,
    token,
    inbox,
    timeLeft,
    isPaused,
    togglePause,
    handleReset,
    setRealSession,

    // ✅ UI flags para warning/rojo/blink
    isExpiring,
    isExpired,
  };
};
