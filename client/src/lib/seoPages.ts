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
  const related = slug ? getRelatedPages(slug, 8) : [];

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
            If you need a temporary inbox for a registration or verification
            code, Quantum Mail gives you a fast and simple solution directly in
            your browser.
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

          {related.length > 0 && (
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
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${item.slug}`}
                    className="qm-about__text"
                    style={{
                      textDecoration: "none",
                      color: "rgba(0,255,200,0.9)",
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
