export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const email = req.body;

      console.log("EMAIL_RECIBIDO", email);

      return res.status(200).json({
        ok: true,
        message: "Email recibido correctamente",
        data: email
      });

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({
        ok: false,
        error: "Error procesando email"
      });
    }
  }

  return res.status(200).json({
    ok: true,
    message: "API inbox activa 🚀"
  });
}