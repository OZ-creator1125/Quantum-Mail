import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        <header className="qm-header" style={{ marginBottom: 40 }}>
          <FileText className="qm-logo" />
          <h1 className="qm-brand">TERMS OF SERVICE</h1>
        </header>

        <div className="qm-panel">
          <div className="qm-panel__inner">

            <p>
              Quantum Mail provides temporary disposable email addresses for
              privacy protection and quick account verification.
            </p>

            <p>
              The service is provided "as is" without guarantees of uptime,
              message delivery, or storage duration.
            </p>

            <p>
              Users agree not to use Quantum Mail for illegal activities,
              harassment, fraud, or abuse of third-party services.
            </p>

            <p>
              Quantum Mail reserves the right to modify, suspend, or discontinue
              the service at any time without prior notice.
            </p>

            <p>
              By using this service you agree to these terms.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
