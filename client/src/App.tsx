import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SEO ENGLISH */}
        <Route path="/temp-mail" element={<Home />} />
        <Route path="/temporary-email" element={<Home />} />
        <Route path="/disposable-email" element={<Home />} />
        <Route path="/10-minute-email" element={<Home />} />
        <Route path="/free-temp-mail" element={<Home />} />
        <Route path="/anonymous-email" element={<Home />} />
        <Route path="/burner-email" element={<Home />} />
        <Route path="/random-email-generator" element={<Home />} />
        <Route path="/temp-email-generator" element={<Home />} />
        <Route path="/secure-temp-mail" element={<Home />} />

        {/* SEO ESPAÑOL */}
        <Route path="/correo-temporal" element={<Home />} />
        <Route path="/email-temporal" element={<Home />} />
        <Route path="/correo-desechable" element={<Home />} />
        <Route path="/correo-anonimo" element={<Home />} />
        <Route path="/generador-email" element={<Home />} />
        <Route path="/email-temporal-gratis" element={<Home />} />
        <Route path="/correo-10-minutos" element={<Home />} />

        {/* LEGAL */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}
