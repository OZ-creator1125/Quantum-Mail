import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import SEOPage from "./pages/SEOPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/:slug" element={<SEOPage />} />
      </Routes>
    </BrowserRouter>
  );
}
