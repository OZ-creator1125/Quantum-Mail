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

      // ✅ copy automatically (ONLY ONCE)
      await navigator.clipboard.writeText(s.address);

      // ✅ premium banner (3s)
      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 3000);

      // ✅ set COPY button to "COPIED" (2s)
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
    <div className="qm-shell">
      {/* Banner (premium) */}
      {showCopiedBanner && (
        <div className="qm-banner">
          <div className="qm-banner-inner">
            <p className="qm-title qm-cyan">NEW EMAIL GENERATED &amp; COPIED</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="qm-header">
        <div className="qm-header-left">
          <ShieldAlert className="qm-logo" />
          <h1 className="qm-brand">QUANTUM_MAIL</h1>
        </div>
      </header>

      {/* TOP GRID: Identity (2 cols) + Timer (1 col) */}
      <section className="qm-top">
        {/* Identity */}
        <div className="qm-panel qm-panel-cyan">
          <div className="qm-panel-pad">
            <div className="qm-kicker">CURRENT IDENTITY</div>

            <div className="qm-identity-row">
              <div className="qm-identity-box">
                <span className="qm-identity-text">
                  {currentEmail || "GENERATING..."}
                </span>
              </div>

              <Button
                onClick={handleCopy}
                data-testid="button-copy"
                variant="outline"
                className="qm-btn qm-btn-cyan"
              >
                {copied ? <Check className="qm-ico" /> : <Copy className="qm-ico" />}
                <span className="qm-btn-text">{copied ? "COPIED" : "COPY"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="qm-panel qm-panel-purple">
          <div className="qm-panel-pad qm-center">
            <div className="qm-kicker qm-center-text">TIME REMAINING</div>

            <div className="qm-timer">{formatTime(timeLeft)}</div>

            <div className="qm-timer-actions">
              <Button
                variant="outline"
                onClick={togglePause}
                data-testid="button-pause"
                className="qm-btn qm-btn-purple"
              >
                {isPaused ? <Play className="qm-ico" /> : <Pause className="qm-ico" />}
                <span className="qm-btn-text">{isPaused ? "RESUME" : "PAUSE"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleRealNew}
                data-testid="button-reset"
                className="qm-btn qm-btn-cyan"
              >
                <RefreshCw className="qm-ico" />
                <span className="qm-btn-text">NEW</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM: Inbox FULL WIDTH (sin Archives, sin espacio) */}
      <section className="qm-bottom">
        <div className="qm-panel qm-panel-plain">
          <div className="qm-section-head">
            <div className="qm-section-left">
              <InboxIcon className="qm-sec-ico" />
              <h2 className="qm-section-title">
                SECURE_INBOX{" "}
                <span className="qm-count">({inbox.length})</span>
              </h2>
            </div>

            {isPaused && (
              <span className="qm-paused">RECEIVING PAUSED</span>
            )}
          </div>

          <ScrollArea className="qm-scroll">
            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -22 }}
                  className="qm-detail"
                >
                  <button
                    className="qm-back"
                    onClick={() => setSelectedEmail(null)}
                    type="button"
                  >
                    <ChevronLeft className="qm-back-ico" />
                    BACK TO INBOX
                  </button>

                  <div className="qm-detail-grid">
                    <div>
                      <div className="qm-label">FROM</div>
                      <div className="qm-from">{selectedEmail.sender}</div>
                    </div>

                    <div>
                      <div className="qm-label">SUBJECT</div>
                      <div className="qm-subject">{selectedEmail.subject}</div>
                    </div>

                    <div className="qm-body">{selectedEmail.body}</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" className="qm-list">
                  {inbox.length === 0 ? (
                    <div className="qm-empty">
                      <RefreshCw className="qm-spin" />
                      <div className="qm-empty-text">AWAITING TRANSMISSIONS...</div>
                    </div>
                  ) : (
                    <div className="qm-items">
                      {inbox.map((msg, idx) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.03, 0.25) }}
                          className="qm-item"
                          onClick={() => setSelectedEmail(msg)}
                          data-testid={`row-email-${msg.id}`}
                        >
                          <div className="qm-item-top">
                            <div className="qm-sender">{msg.sender}</div>
                            <div className="qm-date">
                              {msg.timestamp
                                ? new Date(msg.timestamp as any).toLocaleString()
                                : ""}
                            </div>
                          </div>

                          <div className="qm-item-subject">{msg.subject}</div>
                          <div className="qm-item-preview">{msg.preview}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </section>
    </div>
  );
}
