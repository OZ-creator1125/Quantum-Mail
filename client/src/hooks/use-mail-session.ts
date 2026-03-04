import { useState, useEffect, useCallback, useRef } from "react";
import { EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ RESET TOTAL: borra todo y crea un correo REAL nuevo
  const handleReset = useCallback(async () => {
    try {
      // 1) borra todo
      setInbox([]);
      setToken("");
      setIsPaused(false);
      setTimeLeft(600);

      // 2) borra storage
      localStorage.removeItem("quantum_session");

      // 3) crea correo REAL nuevo
      const s = await createSession(); // { address, token }

      // 4) setea estado
      setCurrentEmail(s.address);
      setToken(s.token);

      // 5) guarda sesión limpia
      localStorage.setItem(
        "quantum_session",
        JSON.stringify({
          currentEmail: s.address,
          token: s.token,
          inbox: [],
          timeLeft: 600,
          isPaused: false,
          lastSaved: Date.now(),
        }),
      );
    } catch (e) {
      console.error("RESET REAL ERROR:", e);
    }
  }, []);

  // ✅ BOOT: al abrir la app, usar sesión guardada o crear una real
  useEffect(() => {
    const boot = async () => {
      try {
        const savedSession = localStorage.getItem("quantum_session");

        if (savedSession) {
          const parsed = JSON.parse(savedSession);

          setCurrentEmail(parsed.currentEmail || "");
          setToken(parsed.token || "");
          setInbox(Array.isArray(parsed.inbox) ? parsed.inbox : []);

          const elapsed = Math.floor((Date.now() - (parsed.lastSaved || Date.now())) / 1000);
          const newTime = parsed.isPaused ? parsed.timeLeft : (parsed.timeLeft - elapsed);

          if (!newTime || newTime <= 0) {
            await handleReset();
            return;
          }

          setTimeLeft(newTime);
          setIsPaused(!!parsed.isPaused);
          return;
        }

        // primera vez: crea correo REAL
        await handleReset();
      } catch (e) {
        console.error("BOOT ERROR:", e);
        await handleReset();
      }
    };

    boot();
  }, [handleReset]);

  // ✅ SAVE: guarda cambios en storage (SIN HISTORIAL)
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
      }),
    );
  }, [currentEmail, token, inbox, timeLeft, isPaused]);

  // ✅ TIMER: cuenta regresiva
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPaused || !currentEmail || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // cuando llega a 0, resetea todo
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

  // ✅ POLLING REAL: trae correos con token
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    if (!token || isPaused) return;

const tick = async () => {
  setIsLoading(true);
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
    console.error("Error obteniendo inbox:", err);
  } finally {
    setIsLoading(false);
  }
};
    // 1) corre inmediato
    tick();
    // 2) luego cada 4s
    pollRef.current = setInterval(tick, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, isPaused]);

  const togglePause = () => setIsPaused((p) => !p);
  const addExtraTime = () => setTimeLeft(600);

  // ✅ NEW: crea sesión REAL (igual que reset pero sin tocar timerRef directo)
  const setRealSession = useCallback(
    (session: { address: string; token: string }) => {
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
        }),
      );
    },
    [],
  );

  return {
  currentEmail,
  token,
  inbox,
  timeLeft,
  isPaused,
  isLoading, // ✅
  togglePause,
  handleReset,
  addExtraTime,
  setRealSession,
};
