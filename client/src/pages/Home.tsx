
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

      // ✅ copy automatically (ONLY ONCE)
      await navigator.clipboard.writeText(s.address);

      // ✅ premium banner (3s)
      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 3000);

      // ✅ set COPY button to "COPIED" (2s)
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // ✅ toast in English
      toast({
        title: "✅ Email copied to clipboard",
        description: "Paste anywhere (Ctrl+V / Cmd+V)",
        className: "bg-primary text-primary-foreground font-display",
      });

      // ✅ switch session + clear selected email
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

  const handleCopy = () => {
    if (!currentEmail) return;
    navigator.clipboard.writeText(currentEmail);

    setCopied(true);
    toast({
      title: "✅ Email copied to clipboard",
      description: "Paste anywhere (Ctrl+V / Cmd+V)",
      className: "bg-primary text-primary-foreground font-display",
    });

    setTimeout(() => setCopied(false), 2000);
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
        <div className="mb-4 glass-panel q-accent-left rounded-xl px-4 py-3 text-center">
          <p className="q-title text-sm" style={{ color: "var(--cyan)" }}>
            NEW EMAIL GENERATED &amp; COPIED
          </p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8" style={{ color: "var(--cyan)" }} />
        <h1 className="q-title text-2xl font-bold tracking-wider" style={{ color: "var(--cyan)" }}>
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top row: identity (2 cols) + timer (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Identity */}
        <div className="lg:col-span-2 glass-panel q-accent-left p-6 rounded-xl">
          <h2 className="q-title text-xs mb-2 q-muted">CURRENT IDENTITY</h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full q-email-box font-mono text-xl md:text-2xl break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              onClick={handleCopy}
              data-testid="button-copy"
              className="q-btn q-btn-cyan w-full sm:w-auto px-6 q-title"
              variant="outline"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="glass-panel q-accent-left-purple p-6 rounded-xl flex flex-col justify-center items-center">
          <h2 className="q-title text-xs mb-2 q-muted">TIME REMAINING</h2>

          <div className="q-timer mb-4">{formatTime(timeLeft)}</div>

          {/* Buttons layout like screenshot: same width, aligned */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              onClick={togglePause}
              data-testid="button-pause"
              className="q-btn q-btn-purple w-full gap-2 q-title"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              onClick={handleRealNew}
              data-testid="button-reset"
              className="q-btn q-btn-cyan w-full gap-2 q-title"
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row: inbox (2 cols) + right placeholder panel to match screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[520px]">
        {/* Inbox (span 2) */}
        <div className="lg:col-span-2 glass-panel rounded-xl flex flex-col overflow-hidden">
          <div className="q-section-header p-4 flex items-center gap-2">
            <InboxIcon className="w-5 h-5" style={{ color: "var(--cyan)" }} />
            <h2 className="q-title text-lg">
              SECURE_INBOX{" "}
              <span className="text-sm" style={{ color: "var(--cyan)" }}>
                ({inbox.length})
              </span>
            </h2>
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
                    className="mb-6 gap-2 q-title q-muted hover:text-white"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <div className="q-title text-xs q-muted mb-1">FROM</div>
                      <div className="text-lg font-mono" style={{ color: "var(--cyan)" }}>
                        {selectedEmail.sender}
                      </div>
                    </div>

                    <div>
                      <div className="q-title text-xs q-muted mb-1">SUBJECT</div>
                      <div className="text-xl font-bold">{selectedEmail.subject}</div>
                    </div>

                    <div className="pt-6 border-t border-white/10 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                      {selectedEmail.body}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" className="p-3">
                  {inbox.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-72 q-muted2">
                      <RefreshCw className="w-8 h-8 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                      <p className="q-title text-xs">AWAITING TRANSMISSIONS...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inbox.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="q-inbox-item p-4 cursor-pointer transition-all"
                          onClick={() => setSelectedEmail(msg)}
                          data-testid={`row-email-${msg.id}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div
                              className="font-mono text-sm truncate max-w-[70%]"
                              style={{ color: "var(--cyan)" }}
                            >
                              {msg.sender}
                            </div>
                            <div className="text-xs font-mono q-muted">
                              {msg.timestamp
                                ? new Date(msg.timestamp as any).toLocaleString()
                                : ""}
                            </div>
                          </div>

                          <div className="font-bold mb-1 truncate">{msg.subject}</div>

                          <div className="text-sm q-muted truncate">{msg.preview}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Right panel placeholder (to match original layout proportions) */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden">
          <div className="q-section-header p-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-md" style={{ boxShadow: "0 0 0 1px rgba(180,91,255,.25) inset" }} />
            <h2 className="q-title text-lg" style={{ color: "var(--purple)" }}>
              ARCHIVES
            </h2>
          </div>

          <div className="p-4 q-muted">
            <p className="text-sm leading-relaxed">
              (Design-only panel)
              <br />
              Si tu app ya no guarda historial, esta sección puede quedarse solo como panel visual
              para mantener el layout exacto del diseño original.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
