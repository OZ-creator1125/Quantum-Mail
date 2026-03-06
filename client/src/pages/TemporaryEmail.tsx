import { Link } from "react-router-dom";

export default function TemporaryEmail() {
  return (
    <div style={{display:"flex",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{maxWidth:"900px",color:"#e6e6e6",lineHeight:"1.6"}}>

        <h1>Free Temporary Email Generator</h1>

        <p>
          Quantum Mail provides a fast and secure temporary email generator
          that allows you to receive emails without revealing your personal
          inbox. A temporary email address protects your privacy and helps
          avoid spam when signing up for websites or downloading resources.
        </p>

        <p>
          Disposable email services are commonly used for verification emails,
          account registrations, and situations where you want to keep your
          real email address private. With Quantum Mail you can generate an
          anonymous inbox instantly and receive messages directly in your
          browser.
        </p>

        <h2>Why use a temporary email?</h2>

        <ul>
          <li>Protect your personal email from spam</li>
          <li>Create anonymous accounts online</li>
          <li>Receive verification emails safely</li>
          <li>Keep your inbox clean</li>
        </ul>

        <p>
          Quantum Mail is a free temp mail service that generates disposable
          email addresses that automatically expire after a short time.
        </p>

        <div style={{marginTop:"40px"}}>
          <Link to="/" style={{color:"#7df9ff"}}>
            Generate your temporary email now →
          </Link>
        </div>

      </div>
    </div>
  );
}
