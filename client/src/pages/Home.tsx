import { useEffect, useMemo, useRef, useState } from "react";
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
  Sparkles,
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
  const [showCopiedBanner, setShowCopiedBanner] = useState(false);

  // UI FX
  const [justGenerated, setJustGenerated] = useState(false);
  const [justRotated, setJustRotated] = useState(false);

  // Auto-start/rotate guards
  const didAutoStart = useRef(false);
  const rotating = useRef(false);

  const formatTime = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const m = Math.floor(safe / 60).toString().padStart(2, "0");
    const s = (safe % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLastMinute = timeLeft <= 60;
  const isCritical = timeLeft <= 10;

  const timerTone = useMemo(() => {
    if (timeLeft <= 10) return "critical";
    if (timeLeft <= 60) return "warning";
    return "normal";
  }, [timeLeft]);

  const pulseGenerate = () => {
    setJustGenerated(true);
    window.setTimeout(() => setJustGenerated(false), 900);
  };

  const pulseRotate = () => {
    setJustRotated(true);
    window.setTimeout(() => setJustRotated(false), 900);
  };

  const handleRealNew = async (opts?: { silent?: boolean }) => {
    try {
      const s = await createSession();

      // copy automatically
      await navigator.clipboard.writeText(s.address);

      // change session + clear selected email (kills inbox view)
      setRealSession({ address: s.address, token: s.token });
      setSelectedEmail(null);

      // UI: banner
      setShowCopiedBanner(true);
      setTimeout(() => setShowCopiedBanner(false), 2200);

      // UI: copy state
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);

      // UI: glow
      pulseGenerate();

      if (!opts?.silent) {
        toast({
          title: "✅ Email copied to clipboard",
          description: "Paste anywhere (Ctrl+V / Cmd+V)",
          className: "bg-primary text-primary-foreground font-display",
        });
      }
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
    setTimeout(() => setCopied(false), 1200);

    toast({
      title: "✅ Email copied to clipboard",
      description: "Paste anywhere (Ctrl+V / Cmd+V)",
      className: "bg-primary text-primary-foreground font-display",
    });
  };

  // ✅ Auto-generate on first load
  useEffect(() => {
    if (didAutoStart.current) return;
    didAutoStart.current = true;

    // create first identity automatically
    handleRealNew({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Auto-rotate when time hits 0
  useEffect(() => {
    if (isPaused) return;
    if (timeLeft > 0) {
      rotating.current = false;
      return;
    }

    if (rotating.current) return;
    rotating.current = true;

    // Warning pulse
    pulseRotate();

    // Generate next email session
    handleRealNew({ silent: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused]);

  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap">
        {/* Banner */}
        <AnimatePresence>
          {showCopiedBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="qm-banner"
            >
              NEW EMAIL GENERATED & COPIED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="qm-header">
          <ShieldAlert className="qm-logo" />
          <h1 className="qm-brand">QUANTUM_MAIL</h1>
        </header>

        {/* GRID */}
        <div className="qm-grid qm-grid--noarchives">
          {/* CURRENT IDENTITY */}
          <section
            className={[
              "qm-panel qm-panel--identity",
              justGenerated ? "qm-glow-gen" : "",
              justRotated ? "qm-glow-rotate" : "",
            ].join(" ")}
          >
            <div className="qm-accent qm-accent--cyan" />

            <div className="qm-panel__inner">
              <div className="qm-kicker">CURRENT IDENTITY</div>

              <div className="qm-identity-row">
                <div className="qm-email">
                  <span className="qm-email__text">
                    {currentEmail || "GENERATING..."}
                  </span>
                </div>

                <Button
                  onClick={handleCopy}
                  className="qm-btn qm-btn--cyan"
                  data-testid="button-copy"
                >
                  {copied ? <Check className="qm-ico" /> : <Copy className="qm-ico" />}
                  <span className="qm-btn__text">{copied ? "COPIED" : "COPY"}</span>
                </Button>
              </div>

              {/* Tiny helper line */}
              <div className="qm-hint">
                <Sparkles className="qm-hint__ico" />
                Auto-copied on NEW. Paste anywhere instantly.
              </div>
            </div>
          </section>

          {/* TIMER */}
          <section
            className={[
              "qm-panel qm-panel--timer",
              timerTone === "warning" ? "qm-timer-warning" : "",
              timerTone === "critical" ? "qm-timer-critical" : "",
            ].join(" ")}
          >
            <div className="qm-accent qm-accent--purple" />

            <div className="qm-panel__inner qm-panel__inner--center">
              <div className="qm-kicker">TIME REMAINING</div>

              <div className="qm-timer-wrap">
                <div
                  className={[
                    "qm-timer",
                    isLastMinute ? "qm-timer--warn" : "",
                    isCritical ? "qm-timer--critical" : "",
                  ].join(" ")}
                >
                  {formatTime(timeLeft)}
                </div>

                {isLastMinute && (
                  <div className="qm-timer-alert">
                    <TriangleAlert className="qm-timer-alert__ico" />
                    Last minute — everything will be wiped.
                  </div>
                )}
              </div>

              <div className="qm-timer-actions">
                <Button
                  variant="outline"
                  onClick={togglePause}
                  className="qm-btn qm-btn--purple"
                  data-testid="button-pause"
                >
                  {isPaused ? <Play className="qm-ico" /> : <Pause className="qm-ico" />}
                  <span className="qm-btn__text">{isPaused ? "RESUME" : "PAUSE"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleRealNew()}
                  className="qm-btn qm-btn--cyan"
                  data-testid="button-reset"
                >
                  <RefreshCw className="qm-ico" />
                  <span className="qm-btn__text">NEW</span>
                </Button>
              </div>
            </div>
          </section>

          {/* INBOX */}
          <section className="qm-panel qm-panel--inbox">
            <div className="qm-panel__top">
              <div className="qm-panel__title">
                <InboxIcon className="qm-title-ico qm-title-ico--cyan" />
                <span className="qm-title-text">SECURE_INBOX</span>
                <span className="qm-title-count">({inbox.length})</span>
              </div>

              {isPaused && <div className="qm-paused">RECEIVING PAUSED</div>}
            </div>

            <div className="qm-panel__body">
              <ScrollArea className="h-full w-full">
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
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
                    <motion.div key="list" className="qm-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {inbox.length === 0 ? (
                        <div className="qm-empty">
                          <RefreshCw className="qm-empty__spin" />
                          <div className="qm-empty__text">AWAITING TRANSMISSIONS...</div>
                        </div>
                      ) : (
                        <div className="qm-rows">
                          {inbox.map((msg, idx) => (
                            <motion.button
                              key={msg.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(idx * 0.035, 0.35) }}
                              className="qm-row"
                              onClick={() => setSelectedEmail(msg)}
                              data-testid={`row-email-${msg.id}`}
                            >
                              <div className="qm-row__top">
                                <div className="qm-row__from">{msg.sender}</div>
                                <div className="qm-row__time">
                                  {msg.timestamp ? new Date(msg.timestamp as any).toLocaleString() : ""}
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

          {/* ABOUT (Bottom) */}
          <section className="qm-about">
            <div className="qm-about__title">What is Quantum Mail?</div>

            <div className="qm-about__text">
              Quantum Mail generates a disposable email identity that lasts{" "}
              <span className="qm-about__highlight">10 minutes</span>.
              Use it to sign up, verify accounts, or protect your real inbox from spam.
              When the timer ends, the inbox and identity are{" "}
              <span className="qm-about__highlight">automatically wiped</span> and replaced.
            </div>

            <div className="qm-about__bullets">
              <div className="qm-about__bullet">• One-click copy + auto-copy on NEW</div>
              <div className="qm-about__bullet">• Real-time inbox, no account needed</div>
              <div className="qm-about__bullet">• Auto-reset on expiration for maximum privacy</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
