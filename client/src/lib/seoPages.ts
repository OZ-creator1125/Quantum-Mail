import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SEOPage() {

  const { slug } = useParams();

  const keyword = slug
    ?.replaceAll("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "60px 20px",
      fontFamily: "system-ui"
    }}>

      <h1>{keyword}</h1>

      <p>
        {keyword} is a free temporary email solution that allows you to
        receive verification messages without exposing your personal inbox.
        Quantum Mail generates disposable email addresses instantly.
      </p>

      <p>
        Using a temporary email helps protect your privacy online,
        avoid spam, and complete registrations safely. Our disposable
        inbox works instantly and deletes messages automatically.
      </p>

      <h2>How to use {keyword}</h2>

      <ol>
        <li>Open Quantum Mail</li>
        <li>Generate a temporary email</li>
        <li>Use the email for verification</li>
        <li>Receive the message instantly</li>
      </ol>

      <h2>Benefits</h2>

      <ul>
        <li>Protect your real email address</li>
        <li>Avoid spam</li>
        <li>Instant inbox</li>
        <li>No registration required</li>
      </ul>

      <p>
        Start using your temporary email now.
      </p>

      <Link to="/" style={{
        display: "inline-block",
        marginTop: 20,
        padding: "12px 18px",
        background: "#00ffc8",
        color: "#000",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: 600
      }}>
        Generate Temporary Email
      </Link>

    </div>
  );
}
