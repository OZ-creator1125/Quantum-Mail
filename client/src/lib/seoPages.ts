type SeoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
};

const englishBases = [
  {
    slug: "temp-mail",
    title: "Temp Mail",
    desc: "Generate a temporary email address instantly and protect your inbox from spam.",
  },
  {
    slug: "temporary-email",
    title: "Temporary Email",
    desc: "Create a temporary email inbox instantly for registrations and verification emails.",
  },
  {
    slug: "fake-email",
    title: "Fake Email",
    desc: "Use a fake email address to sign up for services without exposing your personal inbox.",
  },
  {
    slug: "disposable-email",
    title: "Disposable Email",
    desc: "Generate a disposable email address instantly and keep your real inbox safe.",
  },
  {
    slug: "10-minute-email",
    title: "10 Minute Email",
    desc: "Get a 10 minute email inbox instantly for quick verifications and short-term usage.",
  },
  {
    slug: "temporary-email-generator",
    title: "Temporary Email Generator",
    desc: "Use a temporary email generator to create disposable inboxes for privacy and testing.",
  },
];

const englishModifiers = [
  {
    slug: "for-verification",
    title: "for Verification",
    desc: "Perfect for email verification, sign-up confirmations and one-time codes.",
  },
  {
    slug: "for-signup",
    title: "for Signup",
    desc: "Ideal for quick account creation without exposing your main email.",
  },
  {
    slug: "for-discord",
    title: "for Discord",
    desc: "Useful for Discord signups, verification flows and temporary email needs.",
  },
  {
    slug: "for-instagram",
    title: "for Instagram",
    desc: "Useful for Instagram signups and temporary verification emails.",
  },
  {
    slug: "for-facebook",
    title: "for Facebook",
    desc: "Useful for Facebook signups, testing and verification messages.",
  },
  {
    slug: "for-tiktok",
    title: "for TikTok",
    desc: "Useful for TikTok registrations and one-time email verification.",
  },
  {
    slug: "free",
    title: "Free",
    desc: "Completely free to use with no signup required.",
  },
  {
    slug: "generator",
    title: "Generator",
    desc: "Create disposable inboxes instantly for temporary use.",
  },
];

const spanishBases = [
  {
    slug: "correo-temporal",
    title: "Correo Temporal",
    desc: "Genera un correo temporal al instante y protege tu bandeja principal del spam.",
  },
  {
    slug: "email-temporal",
    title: "Email Temporal",
    desc: "Crea un email temporal desechable para registros y verificaciones.",
  },
  {
    slug: "correo-desechable",
    title: "Correo Desechable",
    desc: "Usa un correo desechable para registrarte sin exponer tu correo real.",
  },
  {
    slug: "generador-email-temporal",
    title: "Generador de Email Temporal",
    desc: "Genera emails temporales gratis para proteger tu privacidad online.",
  },
];

const spanishModifiers = [
  {
    slug: "gratis",
    title: "Gratis",
    desc: "Disponible gratis y listo para usarse en segundos.",
  },
  {
    slug: "para-verificacion",
    title: "para Verificación",
    desc: "Ideal para recibir correos de verificación y códigos temporales.",
  },
  {
    slug: "para-registro",
    title: "para Registro",
    desc: "Perfecto para registros rápidos sin usar tu correo principal.",
  },
  {
    slug: "para-discord",
    title: "para Discord",
    desc: "Útil para registros y verificaciones temporales en Discord.",
  },
  {
    slug: "para-instagram",
    title: "para Instagram",
    desc: "Útil para verificaciones y registros en Instagram.",
  },
  {
    slug: "para-facebook",
    title: "para Facebook",
    desc: "Útil para registros y verificaciones temporales en Facebook.",
  },
];

function buildPages(): SeoPage[] {
  const pages: SeoPage[] = [];

  for (const base of englishBases) {
    pages.push({
      slug: base.slug,
      title: `${base.title} – Quantum Mail`,
      description: base.desc,
      intro:
        `${base.title} helps you receive messages anonymously, avoid spam, and protect your privacy online.`,
    });

    for (const modifier of englishModifiers) {
      pages.push({
        slug: `${base.slug}-${modifier.slug}`,
        title: `${base.title} ${modifier.title} – Quantum Mail`,
        description: `${base.desc} ${modifier.desc}`,
        intro:
          `${base.title} ${modifier.title.toLowerCase()} is a practical way to keep your personal inbox clean while still receiving temporary messages safely.`,
      });
    }
  }

  for (const base of spanishBases) {
    pages.push({
      slug: base.slug,
      title: `${base.title} – Quantum Mail`,
      description: base.desc,
      intro:
        `${base.title} te ayuda a recibir correos de forma anónima, evitar spam y proteger tu privacidad online.`,
    });

    for (const modifier of spanishModifiers) {
      pages.push({
        slug: `${base.slug}-${modifier.slug}`,
        title: `${base.title} ${modifier.title} – Quantum Mail`,
        description: `${base.desc} ${modifier.desc}`,
        intro:
          `${base.title} ${modifier.title.toLowerCase()} es una forma práctica de mantener limpia tu bandeja principal mientras recibes mensajes temporales de forma segura.`,
      });
    }
  }

  const unique = new Map<string, SeoPage>();
  for (const page of pages) unique.set(page.slug, page);
  return Array.from(unique.values());
}

export const seoPages = buildPages();

export const seoPagesMap = Object.fromEntries(
  seoPages.map((page) => [page.slug, page])
);

export function getRelatedPages(currentSlug: string, limit = 8): SeoPage[] {
  return seoPages.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
