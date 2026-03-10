import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Home from "./Home";
import { uniqueSeoRoutes } from "@shared/seo-routes";

function upsertMeta(name: string, content: string, property = false) {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    if (property) {
      tag.setAttribute("property", name);
    } else {
      tag.setAttribute("name", name);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

export default function SEOPage() {
  const { slug } = useParams();

  const page = useMemo(() => {
    return uniqueSeoRoutes.find((item) => item.slug === slug);
  }, [slug]);

  useEffect(() => {
    const fallbackTitle = "Quantum Mail – Free Temporary Email Generator";
    const fallbackDescription =
      "Generate a free temporary email instantly. Protect your privacy and receive verification emails anonymously with Quantum Mail.";

    const title = page?.title || fallbackTitle;
    const description = page?.description || fallbackDescription;
    const url = page
      ? `https://qmailtemp.com/${page.slug}`
      : "https://qmailtemp.com/";

    document.title = title;

    upsertMeta("description", description);
    upsertMeta("robots", "index, follow, max-image-preview:large");
    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:url", url, true);
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertCanonical(url);
  }, [page]);

  if (!page) {
    return <Home />;
  }

  return (
    <>
      <Home />

      <div className="qm-shell" style={{ paddingTop: 0 }}>
        <div className="qm-wrap">
          <section className="qm-about">
            <h2 className="qm-about__title">{page.title}</h2>
            <p className="qm-about__text">{page.description}</p>
            <p className="qm-about__text" style={{ marginTop: 14 }}>
              {page.body}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
