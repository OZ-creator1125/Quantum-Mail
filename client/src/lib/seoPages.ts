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
  {
    slug: "instant-email",
    title: "Instant Email",
    desc: "Generate an instant temporary inbox and receive messages right away.",
    intro: "Instant Email targets users who want immediate disposable inbox access with no friction.",
  },
  {
    slug: "private-email-generator",
    title: "Private Email Generator",
    desc: "Create a private temporary email address for safer signups and verification.",
    intro: "Private Email Generator targets privacy-focused users who want temporary inbox protection.",
  },
];

const englishIntentModifiers: ModifierEntry[] = [
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
    slug: "for-registration",
    title: "for Registration",
    desc: "Useful for account creation and short-lived registration workflows.",
    intro: "This variation focuses on registration intent and quick account setup.",
  },
  {
    slug: "for-codes",
    title: "for Codes",
    desc: "Useful for receiving one-time confirmation and verification codes.",
    intro: "This page targets users searching for quick inboxes to receive codes.",
  },
  {
    slug: "for-testing",
    title: "for Testing",
    desc: "Useful for QA flows, product testing, and temporary inbox checks.",
    intro: "This page targets developers and testers who need disposable email addresses.",
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
  {
    slug: "without-phone-number",
    title: "without Phone Number",
    desc: "Use temporary inboxes without relying on your main identity details.",
    intro: "This variation targets privacy-minded users trying to reduce personal data exposure.",
  },
];

const englishPlatforms = [
  "discord",
  "instagram",
  "facebook",
  "tiktok",
  "telegram",
  "reddit",
  "youtube",
  "netflix",
  "amazon",
  "paypal",
  "gmail",
  "outlook",
  "linkedin",
  "shopify",
  "roblox",
  "snapchat",
  "steam",
  "epic-games",
  "github",
  "x",
  "twitter",
  "pinterest",
  "tumblr",
  "slack",
  "notion",
  "dropbox",
  "airbnb",
  "uber",
  "spotify",
  "apple",
];

const englishAudiences = [
  "developers",
  "marketers",
  "students",
  "gamers",
  "business",
  "privacy",
  "testers",
  "freelancers",
  "agencies",
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
  {
    slug: "email-desechable",
    title: "Email Desechable",
    desc: "Crea un email desechable para proteger tu correo real y evitar spam.",
    intro: "Email Desechable se orienta a usuarios que buscan una solución rápida y temporal.",
  },
];

const spanishIntentModifiers: ModifierEntry[] = [
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
    slug: "para-codigos",
    title: "para Códigos",
    desc: "Útil para recibir códigos temporales de acceso y confirmación.",
    intro: "Esta variación se enfoca en búsquedas relacionadas con códigos y verificaciones.",
  },
  {
    slug: "para-pruebas",
    title: "para Pruebas",
    desc: "Útil para pruebas de sistemas, registros y validaciones.",
    intro: "Esta página está dirigida a usuarios que hacen pruebas o testing.",
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
  {
    slug: "sin-telefono",
    title: "sin Teléfono",
    desc: "Usa correos temporales sin exponer tu número ni tu identidad principal.",
    intro: "Esta variación atrae a usuarios preocupados por la privacidad.",
  },
];

const spanishPlatforms = [
  "discord",
  "instagram",
  "facebook",
  "tiktok",
  "telegram",
  "reddit",
  "youtube",
  "amazon",
  "paypal",
  "netflix",
  "gmail",
  "outlook",
  "linkedin",
  "shopify",
  "roblox",
  "snapchat",
  "steam",
  "spotify",
];

const spanishAudiences = [
  "estudiantes",
  "desarrolladores",
  "privacidad",
  "negocios",
  "gamers",
  "marketers",
];

function titleCasePlatform(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPages(): SeoPage[] {
  const pages: SeoPage[] = [];

  const addPage = (page: SeoPage) => {
    pages.push(page);
  };

  const buildEnglish = () => {
    for (const base of englishBases) {
      addPage({
        slug: base.slug,
        title: `${base.title} – Quantum Mail`,
        description: base.desc,
        intro: base.intro,
      });

      for (const modifier of englishIntentModifiers) {
        addPage({
          slug: `${base.slug}-${modifier.slug}`,
          title: `${base.title} ${modifier.title} – Quantum Mail`,
          description: `${base.desc} ${modifier.desc}`,
          intro: `${base.intro} ${modifier.intro}`,
        });
      }

      for (const platform of englishPlatforms) {
        const platformName = titleCasePlatform(platform);

        addPage({
          slug: `${base.slug}-for-${platform}`,
          title: `${base.title} for ${platformName} – Quantum Mail`,
          description: `${base.desc} Useful for ${platformName} registrations, signups, testing, and verification messages.`,
          intro: `${base.intro} This page targets searches related to temporary email use for ${platformName}.`,
        });

        addPage({
          slug: `${base.slug}-free-for-${platform}`,
          title: `${base.title} Free for ${platformName} – Quantum Mail`,
          description: `${base.desc} Free temporary email access for ${platformName} workflows and verification messages.`,
          intro: `${base.intro} This variation captures free temp mail intent around ${platformName}.`,
        });

        addPage({
          slug: `${base.slug}-online-for-${platform}`,
          title: `${base.title} Online for ${platformName} – Quantum Mail`,
          description: `${base.desc} Use it online for ${platformName} verification, signup, and disposable inbox access.`,
          intro: `${base.intro} This variation targets online temporary email searches related to ${platformName}.`,
        });
      }

      for (const audience of englishAudiences) {
        const audienceName = titleCasePlatform(audience);

        addPage({
          slug: `${base.slug}-for-${audience}`,
          title: `${base.title} for ${audienceName} – Quantum Mail`,
          description: `${base.desc} Useful for ${audienceName.toLowerCase()} who need temporary inboxes for privacy, testing, or signup flows.`,
          intro: `${base.intro} This variation targets ${audienceName.toLowerCase()} searching for disposable email tools.`,
        });
      }
    }
  };

  const buildSpanish = () => {
    for (const base of spanishBases) {
      addPage({
        slug: base.slug,
        title: `${base.title} – Quantum Mail`,
        description: base.desc,
        intro: base.intro,
      });

      for (const modifier of spanishIntentModifiers) {
        addPage({
          slug: `${base.slug}-${modifier.slug}`,
          title: `${base.title} ${modifier.title} – Quantum Mail`,
          description: `${base.desc} ${modifier.desc}`,
          intro: `${base.intro} ${modifier.intro}`,
        });
      }

      for (const platform of spanishPlatforms) {
        const platformName = titleCasePlatform(platform);

        addPage({
          slug: `${base.slug}-para-${platform}`,
          title: `${base.title} para ${platformName} – Quantum Mail`,
          description: `${base.desc} Útil para registros, verificaciones y uso temporal en ${platformName}.`,
          intro: `${base.intro} Esta página se orienta a búsquedas de correo temporal relacionadas con ${platformName}.`,
        });

        addPage({
          slug: `${base.slug}-gratis-para-${platform}`,
          title: `${base.title} Gratis para ${platformName} – Quantum Mail`,
          description: `${base.desc} Acceso gratis para verificaciones y registros en ${platformName}.`,
          intro: `${base.intro} Esta variación capta búsquedas gratuitas relacionadas con ${platformName}.`,
        });

        addPage({
          slug: `${base.slug}-online-para-${platform}`,
          title: `${base.title} Online para ${platformName} – Quantum Mail`,
          description: `${base.desc} Úsalo online para registros, validaciones y mensajes temporales en ${platformName}.`,
          intro: `${base.intro} Esta variación se enfoca en intención online vinculada a ${platformName}.`,
        });
      }

      for (const audience of spanishAudiences) {
        const audienceName = titleCasePlatform(audience);

        addPage({
          slug: `${base.slug}-para-${audience}`,
          title: `${base.title} para ${audienceName} – Quantum Mail`,
          description: `${base.desc} Útil para ${audience.toLowerCase()} que necesitan correos temporales para pruebas, privacidad o registros.`,
          intro: `${base.intro} Esta variación se dirige a ${audience.toLowerCase()} que buscan una bandeja temporal rápida.`,
        });
      }
    }
  };

  buildEnglish();
  buildSpanish();

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
