import { useState } from "react"
import { useMailSession } from "@/hooks/use-mail-session"
import { EmailMessage } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Copy,
  Pause,
  Play,
  RefreshCw,
  Inbox,
  Check,
  ChevronLeft
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { createSession } from "@/lib/api"

export default function Home() {

  const {
    currentEmail,
    inbox,
    timeLeft,
    isPaused,
    togglePause,
    setRealSession
  } = useMailSession()

  const { toast } = useToast()

  const [copied, setCopied] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)

  const handleRealNew = async () => {
    try {

      const s = await createSession()

      await navigator.clipboard.writeText(s.address)

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Email copied",
        description: "Paste anywhere"
      })

      setRealSession({
        address: s.address,
        token: s.token
      })

      setSelectedEmail(null)

    } catch (err) {
      console.error(err)
    }
  }

  const handleCopy = async () => {

    if (!currentEmail) return

    await navigator.clipboard.writeText(currentEmail)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

  }

  const formatTime = (seconds: number) => {

    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")

    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")

    return `${m}:${s}`
  }

  return (

    <div className="min-h-screen p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-10">

        <div className="text-primary text-3xl">🛡</div>

        <h1 className="text-2xl font-bold tracking-widest text-primary">
          QUANTUM_MAIL
        </h1>

      </div>


      {/* TOP GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* CURRENT IDENTITY */}

        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">

          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Current Identity
          </h2>

          <div className="flex gap-4 items-center">

            <div className="qm-email-box flex-1 p-4 rounded-lg font-mono text-xl break-all">

              {currentEmail}

            </div>

            <Button
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check size={16}/> : <Copy size={16}/>}
              {copied ? "COPIED" : "COPY"}
            </Button>

          </div>

        </div>


        {/* TIMER */}

        <div className="glass-panel p-6 rounded-xl text-center">

          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Time Remaining
          </h2>

          <div className="text-5xl font-bold mb-4 text-accent">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3">

            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={togglePause}
            >
              {isPaused ? <Play size={16}/> : <Pause size={16}/>}
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleRealNew}
            >
              <RefreshCw size={16}/>
              New
            </Button>

          </div>

        </div>

      </div>


      {/* INBOX */}

      <div className="glass-panel rounded-xl overflow-hidden">

        <div className="p-4 border-b border-white/10 flex items-center gap-2">

          <Inbox size={18}/>

          <h2 className="tracking-widest">

            SECURE_INBOX ({inbox.length})

          </h2>

        </div>

        <ScrollArea className="h-[420px]">

          <AnimatePresence>

            {selectedEmail ? (

              <motion.div
                key="detail"
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className="p-6"
              >

                <Button
                  variant="ghost"
                  onClick={() => setSelectedEmail(null)}
                  className="mb-6 gap-2"
                >
                  <ChevronLeft size={16}/>
                  Back
                </Button>

                <div className="space-y-4">

                  <div>

                    <div className="text-xs uppercase text-muted-foreground">
                      From
                    </div>

                    <div className="font-mono text-primary">
                      {selectedEmail.sender}
                    </div>

                  </div>

                  <div>

                    <div className="text-xs uppercase text-muted-foreground">
                      Subject
                    </div>

                    <div className="text-xl font-bold">
                      {selectedEmail.subject}
                    </div>

                  </div>

                  <div className="pt-4 border-t border-white/10 font-mono text-sm whitespace-pre-wrap">

                    {selectedEmail.body}

                  </div>

                </div>

              </motion.div>

            ) : inbox.length === 0 ? (

              <div className="flex items-center justify-center h-[300px] text-muted-foreground">

                Awaiting transmissions...

              </div>

            ) : (

              <div className="p-3 space-y-2">

                {inbox.map(msg => (

                  <div
                    key={msg.id}
                    className="p-4 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-primary/40"
                    onClick={() => setSelectedEmail(msg)}
                  >

                    <div className="text-primary font-mono text-sm">
                      {msg.sender}
                    </div>

                    <div className="font-bold">
                      {msg.subject}
                    </div>

                    <div className="text-sm text-muted-foreground truncate">
                      {msg.preview}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </AnimatePresence>

        </ScrollArea>

      </div>

    </div>

  )
}
