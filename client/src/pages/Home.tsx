import { useMemo, useState } from "react";
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
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { createSession } from "@/lib/api";

export default function Home() {
  const {
    currentEmail,
    inbox,
    timeLeft,
    isPaused,
    isExpired,
    togglePause,
    setRealSession,
  } = useMailSession();

  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [showCopiedBanner, setShowCopiedBanner] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const timeText = useMemo(() => formatTime(timeLeft), [timeLeft]);
  const isLastMinute = timeLeft > 0 && timeLeft <= 60;

  const handleRealNew = async () => {
    try {
      const s = await createSession();

      // Copy automático del nuevo correo
      await navigator.clipboard.writeText(s.address);

      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 2500);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);

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
    setTimeout(() => setCopied(false), 1400);

    toast({
      title: "✅ Email copied to clipboard",
      description: "Paste anywhere (Ctrl+V / Cmd+V)",
      className: "bg-primary text-primary-foreground font-display",
    });
  };

  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap">
        {/* Banner */}
        {showCopiedBanner && (
          <div className="qm-banner">NEW EMAIL GENERATED &amp; COPIED</div>
        )}

        {/* Header */}
        <header className="qm-header">
          <ShieldAlert className="qm-logo" />
          <h1 className="qm-brand">QUANTUM_MAIL</h1>
        </header>

        {/* Grid (SIN ARCHIVES) */}
        <div className="qm-grid qm-grid--noarchives">
          {/* Panel 1: Current Identity */}
          <section className="qm-panel qm-panel--identity">
            <div className="qm-accent qm-accent--cyan" />
            <div className="qm-panel__inner">
              <div className="qm-kicker">CURRENT IDENTITY</div>

              <div className="qm-identity-row">
                <div className="qm-email">
                  <span className="qm-email__text">
                    {currentEmail || (isExpired ? "EXPIRED — CLICK NEW" : "GENERATING...")}
                  </span>
                </div>

                <Button
                  onClick={handleCopy}
                  className="qm-btn qm-btn--cyan"
                  disabled={!currentEmail}
                  data-testid="button-copy"
                >
                  {copied ? <Check className="qm-ico" /> : <Copy className="qm-ico" />}
                  <span className="qm-btn__text">{copied ? "COPIED" : "COPY"}</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Panel 2: Timer */}
          <section className="qm-panel qm-panel--timer">
            <div className="qm-accent qm-accent--purple" />
            <div className="qm-panel__inner qm-panel__inner--center">
              <div className="qm-kicker">TIME REMAINING</div>

              <div className={`qm-timer ${isLastMinute ? "qm-timer--danger" : ""}`}>
                {timeText}
              </div>

              {/* Warning last minute */}
              {isLastMinute && !isExpired && (
                <div className="qm-expire-warning">
                  <TriangleAlert className="qm-expire-warning__ico" />
                  <span>LAST MINUTE — INBOX WILL BE ERASED</span>
                </div>
              )}

              {/* Expired state */}
              {isExpired && (
                <div className="qm-expire-warning">
                  <TriangleAlert className="qm-expire-warning__ico" />
                  <span>SESSION EXPIRED — CLICK NEW TO START</span>
                </div>
              )}

              <div className="qm-timer-actions">
                <Button
                  variant="outline"
                  onClick={togglePause}
                  className="qm-btn qm-btn--purple"
                  disabled={isExpired || !currentEmail}
                  data-testid="button-pause"
                >
                  {isPaused ? <Play className="qm-ico" /> : <Pause className="qm-ico" />}
                  <span className="qm-btn__text">{isPaused ? "RESUME" : "PAUSE"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRealNew}
                  className="qm-btn qm-btn--cyan"
                  data-testid="button-reset"
                >
                  <RefreshCw className="qm-ico" />
                  <span className="qm-btn__text">NEW</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Panel 3: Inbox */}
          <section className="qm-panel qm-panel--inbox">
            <div className="qm-panel__top">
              <div className="qm-panel__title">
                <InboxIcon className="qm-title-ico qm-title-ico--cyan" />
                <span className="qm-title-text">SECURE_INBOX</span>
                <span className="qm-title-count">({inbox.length})</span>
              </div>

              {isPaused && !isExpired && <div className="qm-paused">RECEIVING PAUSED</div>}
              {isExpired && <div className="qm-paused">SESSION EXPIRED</div>}
            </div>

            <div className="qm-panel__body">
              <ScrollArea className="h-full w-full">
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="qm-detail"
                    >
                      <button className="qm-back" onClick={() => setSelectedEmail(null)}>
                        <ChevronLeft className="qm-ico" />
                        BACK TO INBOX
                      </button>

                      <div className="qm-meta">
                        <div className="qm-meta__label">FROM</div>
                        <div className="qm-meta__value qm-meta__value--cyan">
                          {selectedEmail.sender}
                        </div>
                      </div>

                      <div className="qm-meta">
                        <div className="qm-meta__label">SUBJECT</div>
                        <div className="qm-meta__value qm-meta__value--white">
                          {selectedEmail.subject}
                        </div>
                      </div>

                      <div className="qm-body">{selectedEmail.body}</div>
                    </motion.div>
                  ) : (
                    <motion.div key="list" className="qm-list">
                      {isExpired ? (
                        <div className="qm-empty">
                          <RotateCcw className="qm-empty__spin" />
                          <div className="qm-empty__text">SESSION EXPIRED — CLICK NEW</div>
                        </div>
                      ) : inbox.length === 0 ? (
                        <div className="qm-empty">
                          <RotateCcw className="qm-empty__spin" />
                          <div className="qm-empty__text">AWAITING TRANSMISSIONS...</div>
                        </div>
                      ) : (
                        <div className="qm-rows">
                          {inbox.map((msg, idx) => (
                            <motion.button
                              key={msg.id}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="qm-row"
                              onClick={() => setSelectedEmail(msg)}
                            >
                              <div className="qm-row__top">
                                <div className="qm-row__from">{msg.sender}</div>
                                <div className="qm-row__time">
                                  {msg.timestamp
                                    ? new Date(msg.timestamp as any).toLocaleString()
                                    : ""}
                                </div>
                              </div>
                              <div className="qm-row__subject">{msg.subject}</div>
                              <div className="qm-row__preview">{msg.preview}</div>
                            </motion.button>
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

        {/* About / explanation (debajo, premium) */}
        <section className="qm-about">
          <h3 className="qm-about__title">What is Quantum Mail?</h3>
          <p className="qm-about__text">
            Quantum Mail is a free, anonymous 10-minute email address you can use to receive
            verification emails without exposing your real inbox. It helps reduce spam, protects
            your privacy, and makes quick sign-ups safer. When the timer ends, your inbox is erased
            and you can generate a fresh address with NEW.
          </p>
        </section>
      </div>
    </div>
  );
}
