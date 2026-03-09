import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* SEO PAGES */}
        <Route path="/temporary-email" element={<Home />} />
        <Route path="/temp-mail" element={<Home />} />
        <Route path="/disposable-email" element={<Home />} />
        <Route path="/10-minute-email" element={<Home />} />
        <Route path="/free-temp-mail" element={<Home />} />
        <Route path="/anonymous-email" element={<Home />} />

        {/* LEGAL */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}
