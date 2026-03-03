import { useState, useEffect, useCallback, useRef } from "react";
import { generateEmail,EmailMessage } from "../lib/mock-api";
import { createSession } from "@/lib/api";

export interface HistoryItem {
  email: string;
  createdAt: number;
  inbox: EmailMessage[];
}

export const useMailSession = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [inbox, setInbox] = useState<EmailMessage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialization
  useEffect(() => {
    const savedSession = localStorage.getItem("quantum_session");
    let emailToUse = "";

    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      emailToUse = parsed.currentEmail;
      setToken(parsed.token || "");
      setInbox(parsed.inbox || []);
      setHistory([]); // ✅ nunca cargues historial
      
      const elapsed = Math.floor((Date.now() - parsed.lastSaved) / 1000);
      const newTime = parsed.isPaused
        ? parsed.timeLeft
        : parsed.timeLeft - elapsed;

      if (newTime <= 0) {
        emailToUse = generateEmail();
        setInbox([]);
        setTimeLeft(600);
        setIsPaused(false);
      } else {
        setTimeLeft(newTime);
        setIsPaused(parsed.isPaused);
      }
      setCurrentEmail(emailToUse);
    } else {
      emailToUse = generateEmail();
      setCurrentEmail(emailToUse);
      setTimeLeft(600);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (!currentEmail) return;

    localStorage.setItem(
  "quantum_session",
  JSON.stringify({
    currentEmail,
    token,
    inbox,
    history: [], // ✅ siempre vacío
    timeLeft,
    isPaused,
    lastSaved: Date.now(),
  })
    );
  }, [currentEmail, token, inbox, history, timeLeft, isPaused]);
  
const handleReset = useCallback(async () => {
  try {
    localStorage.removeItem("quantum_session");
    
    // 1) borra todo en pantalla
    setInbox([]);
    setHistory([]);
    setToken("");    
    setIsPaused(false);
    setTimeLeft(600);

    // 2) crea un email REAL nuevo
    const s = await createSession(); // { address, token }

    // 3) cambia al email real
    setCurrentEmail(s.address);
    setToken(s.token);

    // 4) guarda limpio en localStorage
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
    console.error("RESET REAL ERROR:", e);
  }
}, []);  
  
  // Timer logic
  useEffect(() => {
    // Siempre limpia el intervalo anterior
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


// ✅ Polling REAL (si hay token)
useEffect(() => {
  if (!token || isPaused) return;

  const tick = async () => {
    try {
      const res = await fetch(
        "https://tempmail-backend-production.up.railway.app/api/inbox",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      console.log("📩 INBOX RAW:", data);
      
      // soporta varios formatos
      const list =
        data?.messages ??
        data?.["hydra:member"] ??
        data?.data ??
        [];

      if (Array.isArray(list)) {
  const mapped = list.map((m: any) => ({
    id: m.id ?? m["@id"] ?? crypto.randomUUID(),
    sender: m?.from?.address ?? "unknown",
    subject: m?.subject ?? "(sin asunto)",
    preview: m?.intro ?? "",
    body: m?.intro ?? "", // por ahora, luego lo mejoramos
    timestamp: m?.createdAt ? new Date(m.createdAt) : new Date(),
  }));

  setInbox(mapped);
}    } catch (err) {
      console.error("Error obteniendo inbox:", err);
    }
  };

  // ✅ 1) dispara una vez inmediato
  tick();
  // ✅ 2) luego cada 4 segundos
  const interval = setInterval(tick, 4000);

  return () => clearInterval(interval);
}, [token, isPaused]);  
  
  const togglePause = () => setIsPaused(!isPaused);
  const addExtraTime = () => setTimeLeft(600);

const setRealSession = useCallback(
  (session: { address: string; token: string }) => {
    // ✅ NUNCA guardar historial
    setHistory([]);

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
        history: [], // ✅ siempre vacío
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
    togglePause,
    handleReset,
    addExtraTime,
    setRealSession,
  };
};
