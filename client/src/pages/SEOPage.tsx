import { useEffect } from "react";
import { Link } from "react-router-dom";

type SeoPageProps = {
  title: string;
  description: string;
};

export default function SeoPage({ title, description }: SeoPageProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

    document.title = title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = previousTitle;
      if (meta) meta.content = previousDescription;
    };
  }, [title, description]);

  return (
    <div className="qm-shell min-h-screen">
      <div className="qm-wrap">
        <section className="qm-about">
          <h1 className="qm-about__title" style={{ fontSize: "2rem", marginBottom: 16 }}>
            {title}
          </h1>

          <p className="qm-about__text">{description}</p>

          <div style={{ marginTop: 28 }}>
            <Link
              to="/"
              className="qm-about__text"
              style={{
                textDecoration: "none",
                color: "rgba(0,255,200,0.9)",
                fontWeight: 600,
              }}
            >
              Generate Temporary Email →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
