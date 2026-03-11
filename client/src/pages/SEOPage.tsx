import { Link, useParams } from "react-router-dom";
import { getRelatedPages, seoPagesMap } from "../lib/seoPages";

export default function SEOPage() {
  const { slug } = useParams();

  const page = seoPagesMap[slug || ""];

  const fallback = {
    title: "Temporary Email – Quantum Mail",
    description:
      "Generate disposable email addresses instantly and receive verification emails anonymously.",
    intro:
      "Quantum Mail lets you create temporary inboxes for privacy, testing, and instant verification messages.",
  };

  const data = page || fallback;
  const related = slug ? getRelatedPages(slug, 16) : [];

  if (typeof document !== "undefined") {
    document.title = data.title;

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = data.description;
  }

  const topLinks = related.slice(0, 8);
  const secondaryLinks = related.slice(8, 16);

  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap">
        <section className="qm-about">
          <h1 className="qm-about__title">{data.title}</h1>

          <p className="qm-about__text">{data.description}</p>

          <p className="qm-about__text" style={{ marginTop: "16px" }}>
            {data.intro}
          </p>

          <p className="qm-about__text" style={{ marginTop: "16px" }}>
            Quantum Mail allows users to generate temporary email addresses
            instantly. These disposable inboxes are useful for account
            verification, testing services, one-time signups, and protecting
            your real email address from unwanted spam.
          </p>

          <p className="qm-about__text" style={{ marginTop: "16px" }}>
            If you need a temporary inbox for a registration, confirmation code,
            or short-term sign up, Quantum Mail gives you a fast and simple
            solution directly in your browser.
          </p>

          <div style={{ marginTop: "24px" }}>
            <Link
              to="/"
              className="qm-about__text"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: "rgba(0,255,200,0.9)",
                fontWeight: 700,
              }}
            >
              Generate Temporary Email →
            </Link>
          </div>

          {/* RELATED SEARCHES */}
          {topLinks.length > 0 && (
            <div
              style={{
                marginTop: "34px",
                paddingTop: "18px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="qm-about__title" style={{ fontSize: "1.2rem" }}>
                Related searches
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                {topLinks.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${item.slug}`}
                    className="qm-about__text"
                    style={{
                      textDecoration: "none",
                      color: "rgba(0,255,200,0.9)",
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* POPULAR TOPICS */}
          {secondaryLinks.length > 0 && (
            <div
              style={{
                marginTop: "28px",
                paddingTop: "18px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="qm-about__title" style={{ fontSize: "1.1rem" }}>
                Popular temporary email topics
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "14px",
                }}
              >
                {secondaryLinks.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${item.slug}`}
                    className="qm-about__text"
                    style={{
                      textDecoration: "none",
                      color: "rgba(0,255,200,0.9)",
                      padding: "8px 12px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* EXTRA INTERNAL LINK TO HOME */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "18px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="qm-about__text">
              Need a real disposable inbox right now?{" "}
              <Link
                to="/"
                style={{
                  color: "rgba(0,255,200,0.9)",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Open Quantum Mail
              </Link>{" "}
              and generate a temporary email instantly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
