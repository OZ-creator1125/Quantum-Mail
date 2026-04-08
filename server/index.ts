import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// 🔥 Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Rutas
app.use(routes);

// 🔥 Health check (para verificar que el server está vivo)
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Quantum backend activo 🚀",
  });
});

// 🔥 Puerto (Vercel usa process.env.PORT automáticamente)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en puerto ${PORT}`);
});