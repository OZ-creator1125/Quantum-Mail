import { useEffect, useRef, useState } from "react";
import { useMailSession } from "@/hooks/use-mail-session";
import { EmailMessage } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Pause,
  Play,
  RefreshCw,
  Inbox as InboxIcon,
  Check,
  ChevronLeft,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { createSession } from "@/lib/api";

export default function Home() {
  const { currentEmail, inbox, timeLeft, isPaused, togglePause, setRealSession } =
    useMailSession();

  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

  // ✅ when timer hits 0, require NEW
  const [expired, setExpired] = useState(false);

  // ensure we auto-start only once
  const didAutoStart = useRef(false);

  const formatTime = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const m = Math.floor(safe / 60).toString().padStart(2, "0");
    const s = (safe % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLastMinute = timeLeft <= 60 && timeLeft > 0;

  // ✅ Auto-start: create session on first load (NO clipboard)
  useEffect(() => {
    if (didAutoStart.current) return;
    didAutoStart.current = true;

    (async () => {
      try {
        const s = await createSession();
        setRealSession({ address: s.address, token: s.token });
        setSelectedEmail(null);
        setExpired(false);
      } catch (err) {
        console.error(err);
        toast({
          title: "❌ Error creating session",
          description: "Try again with NEW",
          className: "bg-destructive text-destructive-foreground font-display",
        });
        setExpired(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ When time ends, lock and require NEW (NO auto-regenerate, no clipboard popups)
  useEffect(() => {
    if (isPaused) return;
    if (timeLeft > 0) return;
    // timeLeft === 0
    if (!expired) {
      setExpired(true);
      setSelectedEmail(null);
      toast({
        title: "⏳ Session expired",
        description: "Click NEW to generate a fresh email.",
        className: "bg-primary text-primary-foreground font-display",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused]);

  // ✅ NEW: generate fresh email (NO clipboard, avoids permission popup)
  const handleNew = async () => {
    try {
      const s = await createSession();
      setRealSession({ address: s.address, token: s.token });
      setSelectedEmail(null);
      setExpired(false);

      toast({
        title: "✅ New email generated",
        description: "Use COPY to copy it.",
        className: "bg-primary text-primary-foreground font-display",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "❌ Error creating new session",
        description: "Check console (F12) and Railway logs",
        className: "bg-destructive text-destructive-foreground font-display",
      });
    }
  };

  // ✅ COPY: only copy on user click → no popup on load
  const handleCopy = async () => {
    if (!currentEmail) return;
    try {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);

      toast({
        title: "✅ Email copied to clipboard",
        description: "Paste anywhere (Ctrl+V / Cmd+V)",
        className: "bg-primary text-primary-foreground font-display",
      });

      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      toast({
        title: "⚠️ Clipboard blocked",
        description: "Browser blocked clipboard. Copy manually.",
        className: "bg-destructive text-destructive-foreground font-display",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-wider text-primary">
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Identity */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

          <h2 className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-display">
            Current Identity
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full bg-black/50 border border-primary/20 rounded-lg p-4 font-mono text-xl md:text-2xl text-white break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 font-display tracking-widest transition-all"
              onClick={handleCopy}
              disabled={!currentEmail || expired}
              data-testid="button-copy"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>

          {/* small helper line */}
          <div className="mt-2 text-xs text-muted-foreground font-display tracking-widest">
            {expired ? "EXPIRED — CLICK NEW TO CONTINUE" : "10-minute secure inbox"}
          </div>
        </div>

        {/* Timer */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full transition-colors ${
              isLastMinute ? "bg-destructive" : "bg-accent"
            }`}
          />

          <h2 className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-display">
            Time Remaining
          </h2>

          <div
            className={`text-5xl font-bold font-display tracking-wider mb-2 transition-colors ${
              isLastMinute ? "text-destructive animate-pulse" : "text-accent"
            }`}
          >
            {formatTime(timeLeft)}
          </div>

          {isLastMinute && !expired && (
            <div className="flex items-center gap-2 text-xs text-destructive font-display tracking-widest mb-3">
              <TriangleAlert className="w-4 h-4" />
              LAST MINUTE — EVERYTHING WILL BE WIPED
            </div>
          )}

          {expired && (
            <div className="flex items-center gap-2 text-xs text-destructive font-display tracking-widest mb-3">
              <TriangleAlert className="w-4 h-4" />
              SESSION EXPIRED — CLICK NEW
            </div>
          )}

          <div className="flex gap-2 w-full font-display">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-black/40 border-accent/30 text-accent hover:bg-accent/20 hover:text-accent transition-all"
              onClick={togglePause}
              disabled={expired}
              data-testid="button-pause"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-black/40 border-primary/30 text-primary hover:bg-primary/20 hover:text-primary transition-all"
              onClick={handleNew}
              data-testid="button-reset"
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden relative border-primary/20">
          <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
            <InboxIcon className="w-5 h-5 text-primary" />
            <h2 className="font-display tracking-widest text-lg">
              SECURE_INBOX{" "}
              <span className="text-primary text-sm">({inbox.length})</span>
            </h2>
            {isPaused && !expired && (
              <span className="ml-auto text-xs text-destructive uppercase animate-pulse font-display">
                Receiving Paused
              </span>
            )}
            {expired && (
              <span className="ml-auto text-xs text-destructive uppercase animate-pulse font-display">
                Expired
              </span>
            )}
          </div>

          <ScrollArea className="flex-1 p-0">
            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 gap-2 text-muted-foreground hover:text-white font-display"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1 font-display">
                        From
                      </div>
                      <div className="text-lg font-mono text-primary">
                        {selectedEmail.sender}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1 font-display">
                        Subject
                      </div>
                      <div className="text-xl font-bold text-white">
                        {selectedEmail.subject}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                      {selectedEmail.body}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" className="p-2 h-full">
                  {expired ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <TriangleAlert className="w-8 h-8 mb-4 opacity-40" />
                      <p className="font-mono text-sm uppercase tracking-widest text-center">
                        Session expired.
                        <br />
                        Click NEW to generate a fresh email.
                      </p>
                    </div>
                  ) : inbox.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <RefreshCw className="w-8 h-8 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                      <p className="font-mono text-sm uppercase tracking-widest">
                        Awaiting transmissions...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inbox.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-black/40 border border-white/5 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          onClick={() => setSelectedEmail(msg)}
                          data-testid={`row-email-${msg.id}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-mono text-sm text-primary truncate max-w-[70%]">
                              {msg.sender}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {msg.timestamp
                                ? new Date(msg.timestamp as any).toLocaleString()
                                : ""}
                            </div>
                          </div>

                          <div className="font-bold mb-1 truncate text-white group-hover:text-primary transition-colors">
                            {msg.subject}
                          </div>

                          <div className="text-sm text-muted-foreground truncate">
                            {msg.preview}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-8 glass-panel p-6 rounded-xl border-primary/20">
        <h3 className="font-display tracking-widest text-lg text-primary mb-2">
          WHAT IS QUANTUM MAIL?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Quantum Mail gives you a temporary inbox that lasts 10 minutes. Use it to
          receive verification codes, protect your real email, and reduce spam.
          When the timer ends, the session is wiped. Click <span className="text-primary">NEW</span>{" "}
          to generate a fresh identity anytime.
        </p>
      </div>
    </div>
  );
}
