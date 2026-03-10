import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import TempMail from "./pages/TempMail";
import TemporaryEmail from "./pages/TemporaryEmail";
import TenMinuteEmail from "./pages/TenMinuteEmail";
import FakeEmail from "./pages/FakeEmail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/temp-mail" element={<TempMail />} />
        <Route path="/temporary-email" element={<TemporaryEmail />} />
        <Route path="/10-minute-email" element={<TenMinuteEmail />} />
        <Route path="/fake-email-generator" element={<FakeEmail />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
