import express from "express";

const router = express.Router();

// 🔥 almacenamiento en memoria (simple y gratis)
let emails: any[] = [];

/**
 * 📥 Recibir emails desde Cloudflare Worker
 */
router.post("/api/inbox", (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ error: "No data received" });
    }

    // Guardar al inicio (más nuevo arriba)
    emails.unshift({
      ...data,
      id: Date.now()
    });

    console.log("📩 EMAIL GUARDADO:", data);

    return res.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR AL GUARDAR EMAIL:", error);
    return res.status(500).json({ error: "Error saving email" });
  }
});

/**
 * 📤 Obtener todos los emails
 */
router.get("/api/inbox", (req, res) => {
  try {
    return res.json(emails);
  } catch (error) {
    console.error("❌ ERROR AL OBTENER EMAILS:", error);
    return res.status(500).json({ error: "Error fetching emails" });
  }
});

/**
 * 🧹 Limpiar inbox (opcional)
 */
router.delete("/api/inbox", (req, res) => {
  emails = [];
  console.log("🗑️ Inbox limpiado");
  return res.json({ ok: true });
});

export default router;