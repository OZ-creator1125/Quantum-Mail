import { useState, useEffect, useCallback, useRef } from "react";
import {
  generateEmail,
  subscribeRealtime,
  EmailMessage,
} from "../lib/mock-api";

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
      setHistory(parsed.history || []);

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
        history,
        timeLeft,
        isPaused,
        lastSaved: Date.now(),
      }),
    );
  }, [currentEmail, token, inbox, history, timeLeft, isPaused]);

  const handleReset = useCallback(() => {
    setHistory((prev) => {
      const newHistory = [
        { email: currentEmail, createdAt: Date.now(), inbox },
        ...prev,
      ].slice(0, 10);
      return newHistory;
    });

    const newEmail = generateEmail();
    setCurrentEmail(newEmail);
    setToken("");
    setInbox([]);
    setTimeLeft(600);
    setIsPaused(false);
  }, [currentEmail, inbox]);
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

  // Realtime Subscription
  // Realtime Subscription (MOCK solo si NO hay token)
  useEffect(() => {
    if (!currentEmail || isPaused || token) return;

    const unsubscribe = subscribeRealtime(currentEmail, (newMsg) => {
      setInbox((prev) => [newMsg, ...prev]);
    });

    return () => unsubscribe();
  }, [currentEmail, isPaused, token]);

 // Polling REAL (si hay token)
useEffect(() => {
  if (!token || isPaused) return;

  const interval = setInterval(async () => {
    try {
      const res = await fetch(
        `https://tempmail-backend-production.up.railway.app/api/inbox`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      // ✅ soporta ambos formatos por si tu backend cambia
      const list =
        data?.["hydra:member"] ??
        data?.messages ??
        data?.data ??
        data;

      if (Array.isArray(list)) {
        setInbox(list);
      }
    } catch (err) {
      console.error("Error obteniendo inbox:", err);
    }
  }, 4000);

  return () => clearInterval(interval);
}, [token, isPaused]);  
  
  const restoreFromHistory = useCallback(
    (emailToRestore: string) => {
      const item = history.find((h) => h.email === emailToRestore);
      if (!item) return;

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.email !== emailToRestore);
        return [
          { email: currentEmail, createdAt: Date.now(), inbox },
          ...filtered,
        ].slice(0, 10);
      });

      setCurrentEmail(item.email);
      setToken("");
      setInbox(item.inbox);
      setTimeLeft(600);
      setIsPaused(false);
    },
    [currentEmail, history, inbox],
  );

  const togglePause = () => setIsPaused(!isPaused);
  const addExtraTime = () => setTimeLeft(600);

  const setRealSession = useCallback(
    (session: { address: string; token: string }) => {
      const newHistory = [
        { email: currentEmail, createdAt: Date.now(), inbox },
        ...history,
      ].slice(0, 10);
      setHistory(newHistory);

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
          history: newHistory,
          timeLeft: 600,
          isPaused: false,
          lastSaved: Date.now(),
        }),
      );
    },
    [currentEmail, inbox, history],
  );

  return {
    currentEmail,
    token,
    inbox,
    history,
    timeLeft,
    isPaused,
    togglePause,
    handleReset,
    restoreFromHistory,
    addExtraTime,
    setRealSession,
  };
};
