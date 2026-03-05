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
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const {
    currentEmail,
    inbox,
    timeLeft,
    isPaused,
    isExpired,
    togglePause,
    handleReset, // NEW button
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
  const isLastMinute = timeLeft > 0 && timeLeft <= 60 && !isExpired;

  const handleCopy = async () => {
    if (!currentEmail || isExpired) return;

    await navigator.clipboard.writeText(currentEmail);

    setCopied(true);
    setShowCopiedBanner(true);

    toast({
      title: "✅ Email copied to clipboard",
      description: "Paste anywhere (Ctrl+V / Cmd+V)",
      className: "bg-primary text-primary-foreground font-display",
    });

    setTimeout(() => setCopied(false), 1400);
    setTimeout(() => setShowCopiedBanner(false), 2500);
  };

  const handleNew = async () => {
    await handleReset();
    setSelectedEmail(null);

    // Optional: auto-copy new email is NOT guaranteed immediately (async state),
    // so we only show a toast. User can click COPY.
    toast({
      title: "✅ New session started",
      description: "Your new inbox is ready.",
      className: "bg-primary text-primary-foreground font-display",
    });
  };

  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap">
        {/* Banner */}
        {showCopiedBanner && (
          <div className="qm-banner">EMAIL COPIED</div>
        )}

        {/* Header */}
        <header className="qm-header">
          <ShieldAlert className="qm-logo" />
          <h1 className="qm-brand">QUANTUM_MAIL</h1>
        </header>

        {/* Grid (NO ARCHIVES) */}
        <div className="qm-grid qm-grid--noarchives">
          {/* Panel 1: Current Identity */}
          <section className="qm-panel qm-panel--identity">
            <div className="qm-accent qm-accent--cyan" />
            <div className="qm-panel__inner">
              <div className="qm-kicker">CURRENT IDENTITY</div>

              <div className="qm-identity-row">
                <div className="qm-email">
                  <span className="qm-email__text">
                    {isExpired
                      ? "SESSION EXPIRED — PRESS NEW"
                      : currentEmail || "GENERATING..."}
                  </span>
                </div>

                <Button
                  onClick={handleCopy}
                  className="qm-btn qm-btn--cyan"
                  disabled={!currentEmail || isExpired}
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

              {/* Last-minute warning */}
              {isLastMinute && (
                <div className="qm-expire-warning">
                  <AlertTriangle className="qm-expire-warning__ico" />
                  SESSION WILL EXPIRE IN UNDER 60 SECONDS
                </div>
              )}

              {/* Expired state note */}
              {isExpired && (
                <div className="qm-expire-warning" style={{ marginTop: 12 }}>
                  <AlertTriangle className="qm-expire-warning__ico" />
                  SESSION EXPIRED — PRESS NEW TO GENERATE A NEW EMAIL
                </div>
              )}

              <div className="qm-timer-actions" style={{ marginTop: 12 }}>
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
                  onClick={handleNew}
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
                          <div className="qm-empty__text">SESSION EXPIRED — PRESS NEW</div>
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

        {/* About section (premium text) */}
        <section className="qm-about">
          <h3 className="qm-about__title">Quantum Mail</h3>
          <p className="qm-about__text">
            Quantum Mail is a privacy-focused temporary email service that instantly generates a disposable inbox. It
            allows you to receive verification emails, activation links, or one-time messages without exposing your real
            email address. The inbox is automatically deleted when the timer expires, keeping your identity private and
            your personal inbox free from spam.
          </p>

          <h3 className="qm-about__title" style={{ marginTop: 14 }}>
            Why would you use Quantum Mail?
          </h3>
          <p className="qm-about__text">
            Many websites require an email address to complete registration, verify an account, or access certain
            features. Using your real email can result in spam, marketing lists, cross-platform tracking, and increased
            security risks. Quantum Mail solves this by providing a temporary email address that self-destructs
            automatically.
          </p>

          <h3 className="qm-about__title" style={{ marginTop: 14 }}>
            How it works
          </h3>
          <p className="qm-about__text">
            When you open the page, a new temporary email address is generated and the timer starts. When 60 seconds
            remain, you’ll see a warning. When the countdown reaches zero, the email address and all messages are deleted
            permanently. Press <strong>NEW</strong> to generate a fresh inbox.
          </p>

          <h3 className="qm-about__title" style={{ marginTop: 14 }}>
            Key Features
          </h3>
          <p className="qm-about__text">
            Instant temporary email generation · No signup required · Anonymous inbox · Automatic expiration & cleanup ·
            Spam and tracking protection · Clean, fast, lightweight interface
          </p>

          <h3 className="qm-about__title" style={{ marginTop: 18 }}>
            FAQ
          </h3>
          <p className="qm-about__text">
            <strong>Does Quantum Mail store my emails permanently?</strong> No. Messages are intended to be temporary and
            are deleted when the timer expires.
            <br />
            <strong>Can I extend the time?</strong> Not in the standard flow. When the timer ends, the inbox is wiped and
            you generate a new one with NEW.
            <br />
            <strong>Can I send emails?</strong> Quantum Mail is designed for receiving emails only.
            <br />
            <strong>Is it safe for important accounts?</strong> No. Don’t use temporary inboxes for banking, password
            recovery, or critical services.
          </p>

          <div style={{ marginTop: 18, opacity: 0.75 }}>
            <p className="qm-about__text" style={{ marginBottom: 6 }}>
              © 2026 <strong>Quantum Mail</strong> — Privacy-first temporary email sessions · Auto-delete by timer · No
              signup required
            </p>
            <p className="qm-about__text" style={{ fontSize: 13 }}>
              Temporary Email · Disposable Email · Burner Email · Spam Protection · Use Cases · FAQ · Privacy Policy
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
