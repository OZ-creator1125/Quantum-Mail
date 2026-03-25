const Imap = require("imap");
const { simpleParser } = require("mailparser");

export async function registerRoutes(httpServer: any, app: any): Promise<any> {
  app.get("/api/inbox", async (_req: any, res: any) => {
    try {
      const imap = new Imap({
        user: process.env.GMAIL_IMAP_USER || "",
        password: process.env.GMAIL_IMAP_PASSWORD || "",
        host: process.env.GMAIL_IMAP_HOST || "imap.gmail.com",
        port: Number(process.env.GMAIL_IMAP_PORT || 993),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      });

      const messages: any[] = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (openErr: any) => {
          if (openErr) {
            imap.end();
            return res
              .status(500)
              .json({ error: "No se pudo abrir INBOX", details: String(openErr) });
          }

          imap.search(["ALL"], (searchErr: any, results: number[]) => {
            if (searchErr) {
              imap.end();
              return res
                .status(500)
                .json({ error: "Error buscando correos", details: String(searchErr) });
            }

            if (!results || results.length === 0) {
              imap.end();
              return res.json([]);
            }

            const latest = results.slice(-10);
            const fetcher = imap.fetch(latest, { bodies: "" });

            fetcher.on("message", (msg: any) => {
              msg.on("body", (stream: any) => {
                simpleParser(stream, (parseErr: any, parsed: any) => {
                  if (parseErr) return;

                  messages.push({
                    from: parsed?.from?.text || "",
                    subject: parsed?.subject || "",
                    text: parsed?.text || "",
                    date: parsed?.date || undefined,
                  });
                });
              });
            });

            fetcher.once("error", (fetchErr: any) => {
              imap.end();
              return res
                .status(500)
                .json({ error: "Error leyendo correos", details: String(fetchErr) });
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

      imap.once("error", (err: any) => {
        return res
          .status(500)
          .json({ error: "Error de conexión IMAP", details: String(err) });
      });

      imap.connect();
    } catch (error: any) {
      return res.status(500).json({
        error: "Error leyendo correos",
        details: String(error),
      });
    }
  });

  return httpServer;
}