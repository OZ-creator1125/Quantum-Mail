import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

export default function App() {
  const path = window.location.pathname;

  if (path === "/privacy") {
    return <Privacy />;
  }

  if (path === "/terms") {
    return <Terms />;
  }

  if (path === "/contact") {
    return <Contact />;
  }

  return <Home />;
}
