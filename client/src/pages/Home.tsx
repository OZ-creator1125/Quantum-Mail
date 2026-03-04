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
        <div className="mb-4 rounded-xl border border-primary/30 bg-black/40 backdrop-blur px-4 py-3 text-center">
          <p className="font-display uppercase tracking-[0.28em] text-primary text-xs md:text-sm">
            NEW EMAIL GENERATED & COPIED
          </p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-[0.22em] text-primary uppercase">
          QUANTUM_MAIL
        </h1>
      </header>

      {/* Top Panel - Email & Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Identity */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h2 className="font-display text-xs md:text-sm text-muted-foreground uppercase tracking-[0.28em] mb-3">
            Current Identity
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full bg-black/55 border border-primary/20 rounded-xl px-5 py-4 font-mono text-lg md:text-2xl text-white tracking-[0.08em] break-all select-all">
              {currentEmail || "GENERATING..."}
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 font-display uppercase tracking-[0.25em] transition-all"
              onClick={handleCopy}
              data-testid="button-copy"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full transition-colors ${
              timeLeft < 60 ? "bg-destructive" : "bg-accent"
            }`}
          />
          <h2 className="font-display text-xs md:text-sm text-muted-foreground uppercase tracking-[0.28em] mb-3">
            Time Remaining
          </h2>

          <div
            className={`font-display text-4xl md:text-5xl font-extrabold tracking-[0.20em] mb-4 transition-colors ${
              timeLeft < 60 ? "text-destructive animate-pulse" : "text-accent"
            }`}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-2 w-full font-display">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-black/40 border-accent/30 text-accent hover:bg-accent/20 hover:text-accent transition-all font-display uppercase tracking-[0.25em]"
              onClick={togglePause}
              data-testid="button-pause"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-black/40 border-primary/30 text-primary hover:bg-primary/20 hover:text-primary transition-all font-display uppercase tracking-[0.25em]"
              onClick={handleRealNew}
              data-testid="button-reset"
            >
              <RefreshCw className="w-4 h-4" />
              NEW
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Inbox Section */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden relative border-primary/20">
          <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
            <InboxIcon className="w-5 h-5 text-primary" />
            <h2 className="font-display tracking-[0.22em] uppercase text-base md:text-lg">
              SECURE_INBOX{" "}
              <span className="text-primary text-sm tracking-[0.15em]">
                ({inbox.length})
              </span>
            </h2>
            {isPaused && (
              <span className="ml-auto text-xs text-destructive uppercase animate-pulse font-display tracking-[0.22em]">
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
                    className="mb-6 gap-2 text-muted-foreground hover:text-white font-display uppercase tracking-[0.22em]"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4" /> BACK TO INBOX
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <div className="font-display text-xs text-muted-foreground uppercase tracking-[0.28em] mb-2">
                        From
                      </div>
                      <div className="text-lg md:text-xl font-mono text-primary tracking-[0.06em] break-all">
                        {selectedEmail.sender}
                      </div>
                    </div>

                    <div>
                      <div className="font-display text-xs text-muted-foreground uppercase tracking-[0.28em] mb-2">
                        Subject
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white tracking-[0.02em]">
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
                  {inbox.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <RefreshCw className="w-8 h-8 mb-4 animate-[spin_3s_linear_infinite] opacity-20" />
                      <p className="font-display text-xs md:text-sm uppercase tracking-[0.30em]">
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
                            <div className="font-mono text-sm text-primary truncate max-w-[70%] tracking-[0.06em]">
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
    </div>
  );
}
