import type { Express } from "express";
import type { Server } from "http";
import Imap from "imap";
import { simpleParser } from "mailparser";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/inbox", async (_req, res) => {
    try {
      const imap = new Imap({
        user: process.env.GMAIL_IMAP_USER,
        password: process.env.GMAIL_IMAP_PASSWORD,
        host: process.env.GMAIL_IMAP_HOST || "imap.gmail.com",
        port: Number(process.env.GMAIL_IMAP_PORT || 993),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      });

      const messages: Array<{
        from: string;
        subject: string;
        text: string;
        date?: Date;
      }> = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (openErr) => {
          if (openErr) {
            imap.end();
            return res.status(500).json({ error: "No se pudo abrir INBOX", details: String(openErr) });
          }

          imap.search(["ALL"], (searchErr, results) => {
            if (searchErr) {
              imap.end();
              return res.status(500).json({ error: "Error buscando correos", details: String(searchErr) });
            }

            if (!results || results.length === 0) {
              imap.end();
              return res.json([]);
            }

            const latest = results.slice(-10);
            const fetcher = imap.fetch(latest, { bodies: "" });

            fetcher.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, (parseErr, parsed) => {
                  if (parseErr) return;

                  messages.push({
                    from: parsed.from?.text || "",
                    subject: parsed.subject || "",
                    text: parsed.text || "",
                    date: parsed.date || undefined,
                  });
                });
              });
            });

            fetcher.once("error", (fetchErr) => {
              imap.end();
              return res.status(500).json({ error: "Error leyendo correos", details: String(fetchErr) });
            });

            fetcher.once("end", () => {
              imap.end();
              const ordered = messages.sort((a, b) => {
                const da = a.date ? new Date(a.date).getTime() : 0;
                const db = b.date ? new Date(b.date).getTime() : 0;
                return db - da;
              });
              return res.json(ordered);
            });
          });
        });
      });

      imap.once("error", (err) => {
        return res.status(500).json({ error: "Error de conexión IMAP", details: String(err) });
      });

      imap.connect();
    } catch (error) {
      return res.status(500).json({
        error: "Error leyendo correos",
        details: String(error),
      });
    }
  });

  return httpServer;
}
