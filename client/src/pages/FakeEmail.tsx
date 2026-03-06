import { Link } from "react-router-dom";

export default function FakeEmail() {
  return (
    <div style={{display:"flex",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{maxWidth:"900px",color:"#e6e6e6",lineHeight:"1.6"}}>

        <h1>Fake Email Generator</h1>

        <p>
          A fake email generator allows you to create an anonymous email address
          that can receive messages without revealing your real inbox.
        </p>

        <p>
          Quantum Mail provides a fast and secure fake email address generator
          that helps protect your privacy online.
        </p>

        <ul>
          <li>Create anonymous email addresses</li>
          <li>Receive verification emails instantly</li>
          <li>Prevent spam in your real inbox</li>
          <li>Temporary inbox that expires automatically</li>
        </ul>

        <div style={{marginTop:"40px"}}>
          <Link to="/" style={{color:"#7df9ff"}}>
            Create a fake email address →
          </Link>
        </div>

      </div>
    </div>
  );
}
