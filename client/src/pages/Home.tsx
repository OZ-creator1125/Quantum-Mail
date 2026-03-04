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

  // premium banner
  const [showCopiedBanner, setShowCopiedBanner] = useState(false);

  const handleRealNew = async () => {
    try {
      const s = await createSession();

      // copy automatically
      await navigator.clipboard.writeText(s.address);

      // banner
      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 3000);

      // set COPY button state
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "✅ Email copied to clipboard",
        description: "Paste anywhere (Ctrl+V / Cmd+V)",
        className: "bg-primary text-primary-foreground font-display",
      });

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
    await navigator.clipboard.writeText(currentEmail);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "✅ Email copied to clipboard",
      description: "Paste anywhere (Ctrl+V / Cmd+V)",
      className: "bg-primary text-primary-foreground font-display",
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      {/* Premium banner */}
      {showCopiedBanner && (
        <div className="mb-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur px-4 py-3 text-center">
          <p className="q-title text-xs" style={{ color: "var(--cyan2)" }}>
            NEW EMAIL GENERATED & COPIED
          </p>
        </div>
      )}

      {/* Header (más discreto como la foto) */}
      <header className="flex items-center gap-3 mb-6 md:mb-8 mt-1">
        <ShieldAlert className="w-7 h-7" style={{ color: "var(--cyan2)" }} />
        <h1 className="q-title text-lg md:text-xl font-bold" style={{ color: "var(--cyan2)" }}>
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
        {/* Current Identity */}
        <div className="lg:col-span-2 glass-panel p-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ background: "var(--cyan2)" }}
          />
          <div className="q-kicker mb-2">CURRENT IDENTITY</div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="q-email q-input flex-1 w-full font-mono text-white break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              onClick={handleCopy}
              data-testid="button-copy"
              className="q-btn-tight w-full sm:w-auto gap-2 bg-black/40 border border-white/10 hover:bg-black/50"
              style={{ color: "var(--cyan2)" }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ background: "var(--purple)" }}
          />

          <div className="q-kicker">TIME REMAINING</div>

          <div className={`q-timer mt-3 ${timeLeft < 60 ? "animate-pulse" : ""}`}>
            {formatTime(timeLeft)}
          </div>

          <div className="mt-5 flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={togglePause}
              data-testid="button-pause"
              className="q-btn-tight flex-1 gap-2 bg-black/35 border border-white/10 hover:bg-black/50"
              style={{ color: "var(--purple)" }}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              onClick={handleRealNew}
              data-testid="button-reset"
              className="q-btn-tight flex-1 gap-2 bg-black/35 border border-white/10 hover:bg-black/50"
              style={{ color: "var(--cyan2)" }}
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[520px]">
        {/* Inbox Section */}
        <div className="glass-panel flex flex-col overflow-hidden relative">
          <div className="p-5 border-b border-white/10 bg-black/30 flex items-center gap-2">
            <InboxIcon className="w-5 h-5" style={{ color: "var(--cyan2)" }} />
            <h2 className="q-title text-base md:text-lg">
              SECURE_INBOX{" "}
              <span className="text-sm" style={{ color: "var(--cyan2)" }}>
                ({inbox.length})
              </span>
            </h2>
            {isPaused && (
              <span className="ml-auto text-xs uppercase animate-pulse q-title" style={{ color: "var(--purple)" }}>
                Receiving Paused
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
                    className="mb-6 gap-2 text-muted-foreground hover:text-white"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                  </Button>

                  <div className="space-y-5">
                    <div>
                      <div className="q-kicker">FROM</div>
                      <div className="mt-1 text-lg font-mono underline underline-offset-4" style={{ color: "var(--cyan2)" }}>
                        {selectedEmail.sender}
                      </div>
                    </div>

                    <div>
                      <div className="q-kicker">SUBJECT</div>
                      <div className="mt-1 text-2xl font-bold text-white">
                        {selectedEmail.subject}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 whitespace-pre-wrap font-mono text-sm leading-7 text-gray-300">
                      {selectedEmail.body}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" className="p-3 h-full">
                  {inbox.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <RefreshCw className="w-8 h-8 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                      <p className="q-title text-xs">AWAITING TRANSMISSIONS...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inbox.map((msg, idx) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.04, 0.25) }}
                          className="p-4 bg-black/35 border border-white/10 rounded-xl cursor-pointer hover:bg-black/45 hover:border-white/15 transition-all"
                          onClick={() => setSelectedEmail(msg)}
                          data-testid={`row-email-${msg.id}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-mono text-sm truncate max-w-[70%]" style={{ color: "var(--cyan2)" }}>
                              {msg.sender}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground">
                              {msg.timestamp ? new Date(msg.timestamp as any).toLocaleString() : ""}
                            </div>
                          </div>

                          <div className="font-bold mb-1 truncate text-white">
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
    </div>
  );
}
