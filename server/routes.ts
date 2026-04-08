import express from "express";

const router = express.Router();

// 🔥 almacenamiento en memoria
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
 * 📤 Obtener inbox
 */
router.get("/api/inbox", (req, res) => {
  return res.json(emails);
});

/**
 * 🧹 Limpiar inbox
 */
router.delete("/api/inbox", (req, res) => {
  emails = [];
  return res.json({ ok: true });
});

export default router;