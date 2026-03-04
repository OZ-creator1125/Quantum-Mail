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

  const [showCopiedBanner, setShowCopiedBanner] = useState(false);

  const handleRealNew = async () => {
    try {
      const s = await createSession();

      // copy automatically
      await navigator.clipboard.writeText(s.address);

      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 2500);

      setCopied(true);
      setTimeout(() => setCopied(false), 1600);

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
    setTimeout(() => setCopied(false), 1600);

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
      {showCopiedBanner && (
        <div className="mb-4 q-panel q-bar-cyan px-4 py-3 text-center">
          <p className="q-title text-[11px] md:text-xs" style={{ color: "var(--cyan2)" }}>
            NEW EMAIL GENERATED & COPIED
          </p>
        </div>
      )}

      <header className="flex items-center gap-3 mb-6 md:mb-8">
        <ShieldAlert className="w-8 h-8" style={{ color: "var(--cyan2)" }} />
        <h1 className="q-title text-xl md:text-2xl font-bold" style={{ color: "var(--cyan2)" }}>
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
        {/* Email */}
        <div className="lg:col-span-2 q-panel q-bar-cyan p-6">
          <div className="q-title text-[11px] md:text-xs" style={{ color: "var(--muted)" }}>
            CURRENT IDENTITY
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="q-email flex-1 w-full p-4 font-mono text-lg md:text-2xl break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              size="lg"
              className="q-btn q-btn-cyan w-full sm:w-auto gap-2 font-semibold q-title"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="q-panel q-bar-purple p-6 flex flex-col justify-center items-center">
          <div className="q-title text-[11px] md:text-xs" style={{ color: "var(--muted)" }}>
            TIME REMAINING
          </div>

          <div
            className={`mt-3 text-5xl font-black q-title ${
              timeLeft < 60 ? "animate-pulse" : ""
            }`}
            style={{ color: "var(--purple)" }}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="mt-5 flex gap-3 w-full">
            <Button
              variant="outline"
              size="sm"
              className="q-btn q-btn-purple flex-1 gap-2 q-title"
              onClick={togglePause}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="q-btn q-btn-cyan flex-1 gap-2 q-title"
              onClick={handleRealNew}
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        <div className="q-panel q-bar-cyan flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-black/30 flex items-center gap-2">
            <InboxIcon className="w-5 h-5" style={{ color: "var(--cyan2)" }} />
            <h2 className="q-title text-base md:text-lg">
              SECURE_INBOX{" "}
              <span style={{ color: "var(--cyan2)" }} className="text-sm">
                ({inbox.length})
              </span>
            </h2>

            {isPaused && (
              <span className="ml-auto text-[11px] q-title animate-pulse" style={{ color: "var(--purple)" }}>
                RECEIVING PAUSED
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
                    className="mb-6 gap-2 q-title"
                    style={{ color: "var(--muted)" }}
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <div className="q-title text-[11px]" style={{ color: "var(--muted)" }}>
                        FROM
                      </div>
                      <div className="text-lg font-mono" style={{ color: "var(--cyan2)" }}>
                        {selectedEmail.sender}
                      </div>
                    </div>

                    <div>
                      <div className="q-title text-[11px]" style={{ color: "var(--muted)" }}>
                        SUBJECT
                      </div>
                      <div className="text-xl font-bold">{selectedEmail.subject}</div>
                    </div>

                    <div className="pt-6 border-t border-white/10 whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/80">
                      {selectedEmail.body}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" className="p-2 h-full">
                  {inbox.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-white/45">
                      <RefreshCw className="w-8 h-8 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                      <p className="q-title text-xs">AWAITING TRANSMISSIONS...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                      {inbox.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: "rgba(0,0,0,0.35)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.border =
                              "1px solid rgba(46,246,255,0.35)";
                            (e.currentTarget as HTMLDivElement).style.background =
                              "rgba(46,246,255,0.04)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.border =
                              "1px solid rgba(255,255,255,0.06)";
                            (e.currentTarget as HTMLDivElement).style.background =
                              "rgba(0,0,0,0.35)";
                          }}
                          onClick={() => setSelectedEmail(msg)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-mono text-sm truncate max-w-[70%]" style={{ color: "var(--cyan2)" }}>
                              {msg.sender}
                            </div>
                            <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                              {msg.timestamp ? new Date(msg.timestamp as any).toLocaleString() : ""}
                            </div>
                          </div>

                          <div className="font-bold mb-1 truncate">{msg.subject}</div>
                          <div className="text-sm truncate" style={{ color: "var(--muted)" }}>
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
