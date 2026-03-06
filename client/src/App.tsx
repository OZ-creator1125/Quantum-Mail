import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TemporaryEmail from "./pages/TemporaryEmail";
import TempMail from "./pages/TempMail";
import FakeEmail from "./pages/FakeEmail";
import TenMinuteEmail from "./pages/TenMinuteEmail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/temporary-email" element={<TemporaryEmail />} />
        <Route path="/temp-mail" element={<TempMail />} />
        <Route path="/fake-email" element={<FakeEmail />} />
        <Route path="/10-minute-email" element={<TenMinuteEmail />} />

      </Routes>
    </BrowserRouter>
  );
}
