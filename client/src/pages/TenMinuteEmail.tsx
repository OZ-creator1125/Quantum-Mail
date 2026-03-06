import { Link } from "react-router-dom";

export default function TenMinuteEmail() {
  return (
    <div style={{display:"flex",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{maxWidth:"900px",color:"#e6e6e6",lineHeight:"1.6"}}>

        <h1>10 Minute Email</h1>

        <p>
          A 10 minute email is a temporary inbox that automatically expires
          after a short time. It is perfect for receiving verification emails
          without sharing your personal email address.
        </p>

        <p>
          Quantum Mail generates disposable email addresses instantly and
          deletes them automatically after expiration.
        </p>

        <ul>
          <li>Instant temporary email address</li>
          <li>Anonymous email inbox</li>
          <li>Spam protection</li>
          <li>Automatic expiration</li>
        </ul>

        <div style={{marginTop:"40px"}}>
          <Link to="/" style={{color:"#7df9ff"}}>
            Get your 10 minute email →
          </Link>
        </div>

      </div>
    </div>
  );
}
