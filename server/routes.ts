import type { Express } from "express";
import { createServer, type Server } from "http";
import Imap from "imap";
import { simpleParser } from "mailparser";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/inbox", async (req, res) => {
    try {
      const imap = new Imap({
        user: process.env.GMAIL_IMAP_USER,
        password: process.env.GMAIL_IMAP_PASSWORD,
        host: process.env.GMAIL_IMAP_HOST,
        port: Number(process.env.GMAIL_IMAP_PORT),
        tls: true,
      });

      const messages: any[] = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", false, () => {
          imap.search(["ALL"], (err, results) => {
            if (!results || results.length === 0) {
              imap.end();
              return res.json([]);
            }

            const f = imap.fetch(results.slice(-10), { bodies: "" });

            f.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  messages.push({
                    from: parsed.from?.text,
                    subject: parsed.subject,
                    text: parsed.text,
                  });
                });
              });
            });

            f.once("end", () => {
              imap.end();
              res.json(messages);
            });
          });
        });
      });

      imap.connect();

    } catch (error) {
      res.status(500).json({ error: "Error leyendo correos" });
    }
  });

  return httpServer;
}
