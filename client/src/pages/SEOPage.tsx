import { useParams } from "react-router-dom";
import Home from "./Home";

const seoContent: Record<string, { title: string; text: string }> = {

  "temp-mail": {
    title: "Free Temp Mail Generator",
    text: "Generate a free temporary email instantly with Quantum Mail. Use temp mail to receive verification emails anonymously."
  },

  "temporary-email": {
    title: "Temporary Email Address Generator",
    text: "Create a temporary email address in seconds. Protect your inbox from spam using Quantum Mail."
  },

  "disposable-email": {
    title: "Disposable Email Service",
    text: "Disposable email addresses help you sign up to websites without exposing your real email."
  },

  "correo-temporal": {
    title: "Correo Temporal Gratis",
    text: "Genera un correo temporal gratis para recibir emails de verificación sin usar tu correo real."
  },

  "email-temporal": {
    title: "Email Temporal",
    text: "Crea un email temporal instantáneo y protege tu privacidad en internet."
  }

};

export default function SEOPage() {

  const { slug } = useParams();

  const data = seoContent[slug || ""] || {
    title: "Temporary Email Generator",
    text: "Generate a disposable email instantly with Quantum Mail."
  };

  return (
    <>
      <title>{data.title}</title>

      <meta name="description" content={data.text} />

      <Home />

      <section style={{display:"none"}}>
        <h1>{data.title}</h1>
        <p>{data.text}</p>
      </section>
    </>
  );
}
