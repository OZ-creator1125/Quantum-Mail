import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        <header className="qm-header" style={{ marginBottom: 40 }}>
          <Mail className="qm-logo" />
          <h1 className="qm-brand">CONTACT</h1>
        </header>

        <div className="qm-panel">
          <div className="qm-panel__inner">

            <p>
              For questions, support requests, or feedback regarding Quantum Mail,
              please contact us at:
            </p>

            <p style={{ marginTop: 20, fontWeight: "bold" }}>
              support@qmailtemp.com
            </p>

            <p style={{ marginTop: 20 }}>
              We aim to respond as soon as possible.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
