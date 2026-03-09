import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>
        
        <header className="qm-header" style={{ marginBottom: 40 }}>
          <ShieldCheck className="qm-logo" />
          <h1 className="qm-brand">PRIVACY POLICY</h1>
        </header>

        <div className="qm-panel">
          <div className="qm-panel__inner">

            <p>
              Quantum Mail is designed to protect your privacy by allowing users
              to generate temporary email addresses without registration.
            </p>

            <p>
              We do not collect personal information such as names, phone numbers,
              or permanent email addresses.
            </p>

            <p>
              Temporary inboxes exist only for the duration of the session timer.
              When the timer expires, the inbox and all received messages are
              automatically deleted.
            </p>

            <p>
              Quantum Mail does not guarantee long-term storage of any message
              received through the temporary email service.
            </p>

            <p>
              This service is intended for testing, sign-ups, and protecting users
              from spam exposure.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
