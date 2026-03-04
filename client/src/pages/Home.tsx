import { useState } from "react";
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

  // Banner premium (cuando NEW genera y copia)
  const [showCopiedBanner, setShowCopiedBanner] = useState(false);

  const handleRealNew = async () => {
    try {
      const s = await createSession();

      // ✅ Copia automático (una sola vez)
      await navigator.clipboard.writeText(s.address);

      // ✅ Banner 3s
      setShowCopiedBanner(true);
      window.setTimeout(() => setShowCopiedBanner(false), 3000);

      // ✅ Estado COPIED 2s
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);

      // ✅ Toast en inglés
      toast({
        title: "✅ Email copied to clipboard",
        description: "Paste anywhere (Ctrl+V / Cmd+V)",
        className: "bg-primary text-primary-foreground font-display",
      });

      // ✅ Cambia sesión + limpia selección
      setRealSession({ address: s.address, token: s.token });
      setSelectedEmail(null);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "❌ Error creating new session",
        description: "Check console (F12) and Railway logs",
        className: "bg-destructive text-destructive-foreground font-display",
      });
    }
  };

  const handleCopy = async () => {
    if (!currentEmail) return;

    try {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);

      toast({
        title: "✅ Email copied to clipboard",
        description: "Paste anywhere (Ctrl+V / Cmd+V)",
        className: "bg-primary text-primary-foreground font-display",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "❌ Clipboard blocked",
        description: "Your browser blocked clipboard access.",
        className: "bg-destructive text-destructive-foreground font-display",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col max-w-7xl mx-auto">
      {/* Premium banner */}
      {showCopiedBanner && (
        <div className="mb-5 rounded-xl border border-primary/30 bg-black/40 backdrop-blur px-4 py-3 text-center">
          <p className="font-display tracking-widest text-primary text-sm">
            NEW EMAIL GENERATED & COPIED
          </p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-7 h-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-primary font-display">
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Identity (span 2) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="qm-accent-left bg-primary" />
          <h2 className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mb-3 font-display">
            Current Identity
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 qm-email-box rounded-xl p-4 font-mono text-lg md:text-2xl text-white break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              size="lg"
              className="qm-btn md:w-[160px] gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 font-display tracking-widest"
              onClick={handleCopy}
              data-testid="button-copy"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center">
          {/* barra derecha (como tu imagen) */}
          <div className="absolute top-0 right-0 w-1 h-full bg-accent opacity-90" />

          <h2 className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mb-3 font-display text-center">
            Time Remaining
          </h2>

          {/* Timer un poco más chico como pediste */}
          <div
            className={`text-4xl md:text-5xl font-bold font-display tracking-wider mb-5 text-center ${
              timeLeft < 60 ? "text-destructive animate-pulse" : "text-accent"
            }`}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="grid grid-cols-2 gap-3 font-display">
            <Button
              variant="outline"
              className="qm-btn gap-2 bg-black/35 border-accent/30 text-accent hover:bg-accent/15 hover:text-accent rounded-xl"
              onClick={togglePause}
              data-testid="button-pause"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              className="qm-btn gap-2 bg-black/35 border-primary/30 text-primary hover:bg-primary/15 hover:text-primary rounded-xl"
              onClick={handleRealNew}
              data-testid="button-reset"
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Inbox */}
      <div className="glass-panel rounded-2xl flex flex-col overflow-hidden relative border-primary/20 flex-1 min-h-[520px]">
        <div className="p-4 md:p-5 border-b border-white/10 bg-black/35 flex items-center gap-2">
          <InboxIcon className="w-5 h-5 text-primary" />
          <h2 className="font-display tracking-widest text-lg md:text-xl">
            SECURE_INBOX{" "}
            <span className="text-primary text-sm">({inbox.length})</span>
          </h2>

          {isPaused && (
            <span className="ml-auto text-xs text-destructive uppercase animate-pulse font-display">
              Receiving Paused
            </span>
          )}
        </div>

        <ScrollArea className="flex-1 p-0">
          <AnimatePresence mode="wait">
            {selectedEmail ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="p-5 md:p-7"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-6 gap-2 text-muted-foreground hover:text-white font-display"
                  onClick={() => setSelectedEmail(null)}
                >
                  <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                </Button>

                <div className="space-y-5">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1 font-display">
                      From
                    </div>
                    <div className="text-lg font-mono text-primary break-all">
                      {selectedEmail.sender}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1 font-display">
                      Subject
                    </div>
                    <div className="text-xl font-bold text-white break-words">
                      {selectedEmail.subject}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                    {selectedEmail.body}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 md:p-4 h-full"
              >
                {inbox.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[420px] text-muted-foreground">
                    <RefreshCw className="w-9 h-9 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                    <p className="font-mono text-sm uppercase tracking-widest">
                      Awaiting transmissions...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {inbox.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="p-4 bg-black/35 border border-white/5 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        onClick={() => setSelectedEmail(msg)}
                        data-testid={`row-email-${msg.id}`}
                      >
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div className="font-mono text-sm text-primary truncate max-w-[70%]">
                            {msg.sender}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono whitespace-nowrap">
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
  );
}
