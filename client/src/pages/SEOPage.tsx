import { useParams } from "react-router-dom"

const seoContent: Record<string, any> = {

  "temporary-email-generator": {
    title: "Temporary Email Generator",
    description:
      "Generate a free temporary email address instantly. Use disposable emails to receive verification messages and protect your privacy.",
  },

  "temp-mail-for-verification": {
    title: "Temp Mail For Verification",
    description:
      "Create a temporary email for account verification. Avoid spam and keep your personal inbox private.",
  },

  "fake-email-generator": {
    title: "Fake Email Generator",
    description:
      "Use a fake email generator to sign up for websites without revealing your real email address.",
  },

  "10-minute-email": {
    title: "10 Minute Email",
    description:
      "Get a 10 minute disposable email inbox instantly. Receive messages and verification codes securely.",
  },

}

export default function SEOPage() {

  const { slug } = useParams()

  const page = seoContent[slug || ""] || {
    title: "Temporary Email",
    description:
      "Generate disposable email addresses instantly and receive verification emails anonymously.",
  }

  return (

    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>

      <h1>{page.title}</h1>

      <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
        {page.description}
      </p>

      <p style={{ marginTop: "20px" }}>
        Quantum Mail allows you to create temporary email addresses instantly.
        These disposable inboxes help protect your identity online and avoid
        spam in your personal mailbox.
      </p>

      <p style={{ marginTop: "20px" }}>
        Simply generate a temporary email address and start receiving messages
        immediately. Temporary emails are useful for account verification,
        testing services, and protecting your online privacy.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "30px",
          padding: "12px 20px",
          background: "#0f172a",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Generate Temporary Email
      </a>

    </div>
  )
}
