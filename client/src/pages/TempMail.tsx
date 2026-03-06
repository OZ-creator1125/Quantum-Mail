import { Link } from "react-router-dom";

export default function TempMail() {
  return (
    <div style={{display:"flex",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{maxWidth:"900px",color:"#e6e6e6",lineHeight:"1.6"}}>

        <h1>Temp Mail – Free Disposable Email</h1>

        <p>
          Temp Mail allows you to generate a disposable email address instantly.
          With Quantum Mail you can receive emails anonymously and avoid spam
          in your personal inbox.
        </p>

        <p>
          Temporary email services are widely used for signing up to websites,
          downloading resources, and receiving verification emails without
          exposing your real email address.
        </p>

        <ul>
          <li>Generate a temporary email instantly</li>
          <li>Protect your real inbox</li>
          <li>Receive verification emails securely</li>
          <li>Avoid spam forever</li>
        </ul>

        <div style={{marginTop:"40px"}}>
          <Link to="/" style={{color:"#7df9ff"}}>
            Generate a temporary email →
          </Link>
        </div>

      </div>
    </div>
  );
}
