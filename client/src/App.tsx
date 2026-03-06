import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TemporaryEmail from "./pages/TemporaryEmail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Página SEO */}
        <Route path="/temporary-email" element={<TemporaryEmail />} />

      </Routes>
    </BrowserRouter>
  );
}
