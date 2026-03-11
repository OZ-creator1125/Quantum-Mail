export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
};

type BaseEntry = {
  slug: string;
  title: string;
  desc: string;
  intro: string;
};

type ModifierEntry = {
  slug: string;
  title: string;
  desc: string;
  intro: string;
};

const englishBases: BaseEntry[] = [
  {
    slug: "temp-mail",
    title: "Temp Mail",
    desc: "Generate a temporary email address instantly and protect your inbox from spam.",
    intro: "Temp Mail helps you receive messages anonymously, avoid spam, and protect your privacy online.",
  },
  {
    slug: "temporary-email",
    title: "Temporary Email",
    desc: "Create a temporary email inbox instantly for registrations and verification emails.",
    intro: "Temporary Email gives you fast access to a disposable inbox for signups, testing, and privacy.",
  },
  {
    slug: "fake-email",
    title: "Fake Email",
    desc: "Use a fake email address to sign up for services without exposing your personal inbox.",
    intro: "Fake Email pages target users who want privacy, quick signups, and disposable inbox access.",
  },
  {
    slug: "disposable-email",
    title: "Disposable Email",
    desc: "Generate a disposable email address instantly and keep your real inbox safe.",
    intro: "Disposable Email helps users receive messages without risking spam in their primary inbox.",
  },
  {
    slug: "10-minute-email",
    title: "10 Minute Email",
    desc: "Get a 10 minute email inbox instantly for quick verifications and short-term usage.",
    intro: "10 Minute Email is ideal for temporary registrations, one-time codes, and short-lived inboxes.",
  },
  {
    slug: "temporary-email-generator",
    title: "Temporary Email Generator",
    desc: "Use a temporary email generator to create disposable inboxes for privacy and testing.",
    intro: "A Temporary Email Generator gives users instant disposable inboxes for signups and verification.",
  },
  {
    slug: "email-generator",
    title: "Email Generator",
    desc: "Create temporary email addresses online and receive messages instantly.",
    intro: "Email Generator pages attract users looking for fast inbox creation and privacy-friendly email tools.",
  },
  {
    slug: "burner-email",
    title: "Burner Email",
    desc: "Create a burner email instantly and receive messages anonymously.",
    intro: "Burner Email is useful when you want a short-term inbox without sharing your personal address.",
  },
  {
    slug: "anonymous-email",
    title: "Anonymous Email",
    desc: "Generate anonymous temporary inboxes and protect your identity online.",
    intro: "Anonymous Email pages target privacy-first users who need a disposable inbox immediately.",
  },
  {
    slug: "disposable-inbox",
    title: "Disposable Inbox",
    desc: "Use a disposable inbox online to receive temporary messages safely.",
    intro: "Disposable Inbox pages target users who want quick and anonymous access to temporary messages.",
  },
  {
    slug: "temporary-inbox",
    title: "Temporary Inbox",
    desc: "Create a temporary inbox instantly for one-time registrations and verification emails.",
    intro: "Temporary Inbox pages attract users looking for easy and private sign-up solutions.",
  },
  {
    slug: "one-time-email",
    title: "One Time Email",
    desc: "Get a one time email address instantly and receive messages anonymously.",
    intro: "One Time Email pages capture users who need temporary inboxes for short-lived tasks.",
  },
];

const englishModifiers: ModifierEntry[] = [
  {
    slug: "for-verification",
    title: "for Verification",
    desc: "Perfect for email verification, sign-up confirmations, and one-time codes.",
    intro: "This variation focuses on users who need temporary email for verification workflows.",
  },
  {
    slug: "for-signup",
    title: "for Signup",
    desc: "Ideal for quick account creation without exposing your main email.",
    intro: "This page is designed for signup-related searches and temporary registration intent.",
  },
  {
    slug: "for-discord",
    title: "for Discord",
    desc: "Useful for Discord signups, verification flows, and temporary inbox needs.",
    intro: "This variation targets Discord-related temporary email searches.",
  },
  {
    slug: "for-instagram",
    title: "for Instagram",
    desc: "Useful for Instagram signups and temporary verification emails.",
    intro: "This page targets users looking for disposable email during Instagram registrations.",
  },
  {
    slug: "for-facebook",
    title: "for Facebook",
    desc: "Useful for Facebook signups, testing, and verification messages.",
    intro: "This variation targets Facebook-related registration and verification intent.",
  },
  {
    slug: "for-tiktok",
    title: "for TikTok",
    desc: "Useful for TikTok registrations and one-time email verification.",
    intro: "This page is focused on TikTok-related temporary email searches.",
  },
  {
    slug: "for-telegram",
    title: "for Telegram",
    desc: "Useful for Telegram signups, verification, and disposable inbox usage.",
    intro: "This variation targets Telegram users needing a temporary inbox.",
  },
  {
    slug: "for-reddit",
    title: "for Reddit",
    desc: "Useful for Reddit registrations and temporary verification emails.",
    intro: "This page is focused on temporary email usage for Reddit account creation.",
  },
  {
    slug: "for-youtube",
    title: "for YouTube",
    desc: "Useful for YouTube account testing, signups, and verification flows.",
    intro: "This variation attracts YouTube-related temporary inbox searches.",
  },
  {
    slug: "for-netflix",
    title: "for Netflix",
    desc: "Useful for streaming-related signups and temporary email workflows.",
    intro: "This page covers temporary email intent around Netflix-related registrations.",
  },
  {
    slug: "for-amazon",
    title: "for Amazon",
    desc: "Useful for Amazon registrations, marketplace testing, and account verification.",
    intro: "This variation targets Amazon-related temporary email searches.",
  },
  {
    slug: "for-paypal",
    title: "for PayPal",
    desc: "Useful for temporary registration flows and disposable verification inboxes.",
    intro: "This page is designed for PayPal-related temp mail search intent.",
  },
  {
    slug: "for-gmail",
    title: "for Gmail",
    desc: "Useful for Gmail-related testing, signups, and temporary verification flows.",
    intro: "This variation targets users searching for disposable inbox use cases connected to Gmail.",
  },
  {
    slug: "for-outlook",
    title: "for Outlook",
    desc: "Useful for Outlook-related signups, validation, and inbox testing.",
    intro: "This page covers Outlook-related temporary email searches.",
  },
  {
    slug: "free",
    title: "Free",
    desc: "Completely free to use with no signup required.",
    intro: "This variation targets users explicitly looking for a free temporary email solution.",
  },
  {
    slug: "generator",
    title: "Generator",
    desc: "Create disposable inboxes instantly for temporary use.",
    intro: "This page is focused on generator-style searches with strong tool intent.",
  },
  {
    slug: "online",
    title: "Online",
    desc: "Use it directly online without installing any app or software.",
    intro: "This variation targets users looking for an online temporary email tool.",
  },
  {
    slug: "no-signup",
    title: "No Signup",
    desc: "No registration required. Generate a disposable inbox instantly.",
    intro: "This variation targets users who want immediate access with zero friction.",
  },
];

const spanishBases: BaseEntry[] = [
  {
    slug: "correo-temporal",
    title: "Correo Temporal",
    desc: "Genera un correo temporal al instante y protege tu bandeja principal del spam.",
    intro: "Correo Temporal te ayuda a recibir mensajes de forma anónima y mantener tu privacidad online.",
  },
  {
    slug: "email-temporal",
    title: "Email Temporal",
    desc: "Crea un email temporal desechable para registros y verificaciones.",
    intro: "Email Temporal es ideal para validaciones, registros rápidos y protección contra spam.",
  },
  {
    slug: "correo-desechable",
    title: "Correo Desechable",
    desc: "Usa un correo desechable para registrarte sin exponer tu correo real.",
    intro: "Correo Desechable está pensado para usuarios que necesitan una bandeja temporal inmediata.",
  },
  {
    slug: "generador-de-correo-temporal",
    title: "Generador de Correo Temporal",
    desc: "Genera emails temporales gratis para proteger tu privacidad online.",
    intro: "Generador de Correo Temporal captura búsquedas con intención directa de herramienta.",
  },
  {
    slug: "correo-anonimo",
    title: "Correo Anónimo",
    desc: "Crea un correo anónimo temporal y recibe mensajes sin usar tu email personal.",
    intro: "Correo Anónimo está orientado a usuarios que buscan más privacidad y menos spam.",
  },
  {
    slug: "bandeja-temporal",
    title: "Bandeja Temporal",
    desc: "Obtén una bandeja temporal para recibir mensajes sin comprometer tu correo real.",
    intro: "Bandeja Temporal atrae búsquedas con intención clara de recibir correos temporales.",
  },
  {
    slug: "correo-de-10-minutos",
    title: "Correo de 10 Minutos",
    desc: "Genera un correo de 10 minutos para registros rápidos y verificaciones temporales.",
    intro: "Correo de 10 Minutos está dirigido a usuarios que necesitan un inbox rápido y desechable.",
  },
];

const spanishModifiers: ModifierEntry[] = [
  {
    slug: "gratis",
    title: "Gratis",
    desc: "Disponible gratis y listo para usarse en segundos.",
    intro: "Esta variación se enfoca en búsquedas con intención de uso gratuito.",
  },
  {
    slug: "para-verificacion",
    title: "para Verificación",
    desc: "Ideal para recibir correos de verificación y códigos temporales.",
    intro: "Esta página apunta a usuarios que buscan correos temporales para verificaciones.",
  },
  {
    slug: "para-registro",
    title: "para Registro",
    desc: "Perfecto para registros rápidos sin usar tu correo principal.",
    intro: "Esta variación está enfocada en registros temporales y signups rápidos.",
  },
  {
    slug: "para-discord",
    title: "para Discord",
    desc: "Útil para registros y verificaciones temporales en Discord.",
    intro: "Esta página está orientada a búsquedas de correo temporal para Discord.",
  },
  {
    slug: "para-instagram",
    title: "para Instagram",
    desc: "Útil para verificaciones y registros en Instagram.",
    intro: "Esta variación está enfocada en tráfico relacionado con Instagram.",
  },
  {
    slug: "para-facebook",
    title: "para Facebook",
    desc: "Útil para registros y verificaciones temporales en Facebook.",
    intro: "Esta página se orienta a búsquedas relacionadas con Facebook.",
  },
  {
    slug: "para-telegram",
    title: "para Telegram",
    desc: "Útil para registros temporales y verificaciones en Telegram.",
    intro: "Esta variación se enfoca en búsquedas de correo temporal para Telegram.",
  },
  {
    slug: "para-tiktok",
    title: "para TikTok",
    desc: "Útil para verificaciones y registros temporales en TikTok.",
    intro: "Esta página está orientada a tráfico relacionado con TikTok.",
  },
  {
    slug: "online",
    title: "Online",
    desc: "Úsalo online sin instalar aplicaciones ni software.",
    intro: "Esta variación capta intención de uso inmediato en navegador.",
  },
  {
    slug: "sin-registro",
    title: "sin Registro",
    desc: "No necesitas registrarte para usarlo.",
    intro: "Esta variación está pensada para usuarios que buscan velocidad y facilidad.",
  },
];

function buildPages(): SeoPage[] {
  const pages: SeoPage[] = [];

  for (const base of englishBases) {
    pages.push({
      slug: base.slug,
      title: `${base.title} – Quantum Mail`,
      description: base.desc,
      intro: base.intro,
    });

    for (const modifier of englishModifiers) {
      pages.push({
        slug: `${base.slug}-${modifier.slug}`,
        title: `${base.title} ${modifier.title} – Quantum Mail`,
        description: `${base.desc} ${modifier.desc}`,
        intro: `${base.intro} ${modifier.intro}`,
      });
    }
  }

  for (const base of spanishBases) {
    pages.push({
      slug: base.slug,
      title: `${base.title} – Quantum Mail`,
      description: base.desc,
      intro: base.intro,
    });

    for (const modifier of spanishModifiers) {
      pages.push({
        slug: `${base.slug}-${modifier.slug}`,
        title: `${base.title} ${modifier.title} – Quantum Mail`,
        description: `${base.desc} ${modifier.desc}`,
        intro: `${base.intro} ${modifier.intro}`,
      });
    }
  }

  const unique = new Map<string, SeoPage>();
  for (const page of pages) {
    unique.set(page.slug, page);
  }

  return Array.from(unique.values());
}

export const seoPages = buildPages();

export const seoPagesMap: Record<string, SeoPage> = Object.fromEntries(
  seoPages.map((page) => [page.slug, page])
);

export function getRelatedPages(currentSlug: string, limit = 12): SeoPage[] {
  return seoPages.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
