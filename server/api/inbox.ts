let emails: any[] = [];

export default function handler(req: any, res: any) {

  if (req.method === "POST") {
    const data = req.body;

    emails.unshift({
      ...data,
      id: Date.now()
    });

    console.log("📩 EMAIL GUARDADO:", data);

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(emails);
  }

  return res.status(405).json({ error: "Method not allowed" });
}