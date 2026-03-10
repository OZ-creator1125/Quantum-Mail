export type SEORoute = {
  slug: string;
  lang: "en" | "es";
  title: string;
  description: string;
  body: string;
};

type Topic = {
  baseSlug: string;
  keyword: string;
  titleBase: string;
  descriptionBase: string;
  bodyBase: string;
};

type Modifier = {
  slug: string;
  label: string;
  descriptionTail: string;
  bodyTail: string;
};

const enBaseTopics: Topic[] = [
  {
    baseSlug: "temp-mail",
    keyword: "temp mail",
    titleBase: "Free Temp Mail",
    descriptionBase: "Get free temp mail instantly with Quantum Mail.",
    bodyBase: "Temp mail helps users protect their real inbox and receive messages anonymously.",
  },
  {
    baseSlug: "temporary-email",
    keyword: "temporary email",
    titleBase: "Temporary Email",
    descriptionBase: "Create a temporary email address instantly with Quantum Mail.",
    bodyBase: "Temporary email addresses are useful for fast signups, verification codes, and privacy protection.",
  },
  {
    baseSlug: "disposable-email",
    keyword: "disposable email",
    titleBase: "Disposable Email",
    descriptionBase: "Use a disposable email address to avoid spam and protect your inbox.",
    bodyBase: "Disposable email services are commonly used for one-time registrations and online forms.",
  },
  {
    baseSlug: "burner-email",
    keyword: "burner email",
    titleBase: "Burner Email",
    descriptionBase: "Generate a burner email instantly using Quantum Mail.",
    bodyBase: "Burner email tools are ideal for temporary online activity and privacy-focused users.",
  },
  {
    baseSlug: "10-minute-email",
    keyword: "10 minute email",
    titleBase: "10 Minute Email",
    descriptionBase: "Get a 10 minute email inbox instantly with Quantum Mail.",
    bodyBase: "A 10 minute email address is useful for quick verifications and short-lived online use.",
  },
  {
    baseSlug: "fake-email-generator",
    keyword: "fake email generator",
    titleBase: "Fake Email Generator",
    descriptionBase: "Use Quantum Mail as a fake email generator for testing and verification.",
    bodyBase: "Fake email generators help users avoid sharing personal inboxes while receiving temporary messages.",
  },
  {
    baseSlug: "anonymous-email",
    keyword: "anonymous email",
    titleBase: "Anonymous Email",
    descriptionBase: "Create an anonymous email inbox with Quantum Mail.",
    bodyBase: "Anonymous email tools help users protect identity and reduce spam exposure.",
  },
  {
    baseSlug: "temp-email-generator",
    keyword: "temp email generator",
    titleBase: "Temp Email Generator",
    descriptionBase: "Generate temp email addresses instantly with Quantum Mail.",
    bodyBase: "A temp email generator is ideal for privacy, online testing, and disposable inbox access.",
  }
];

const enModifiers: Modifier[] = [
  {
    slug: "for-discord",
    label: "for Discord",
    descriptionTail: "Perfect for Discord verification and temporary signups.",
    bodyTail: "Many users search for temp mail for Discord to receive one-time codes without exposing personal email.",
  },
  {
    slug: "for-instagram",
    label: "for Instagram",
    descriptionTail: "Useful for Instagram signups and temporary account testing.",
    bodyTail: "Instagram-related temporary email searches are common among users who want more privacy.",
  },
  {
    slug: "for-facebook",
    label: "for Facebook",
    descriptionTail: "Use it for Facebook registration and one-time verification messages.",
    bodyTail: "Temp email for Facebook is a common use case for avoiding marketing emails in a main inbox.",
  },
  {
    slug: "for-tiktok",
    label: "for TikTok",
    descriptionTail: "Receive TikTok signup and verification emails instantly.",
    bodyTail: "TikTok users often rely on disposable inboxes for quick account creation and verification.",
  },
  {
    slug: "for-verification",
    label: "for Verification",
    descriptionTail: "Built for one-time codes, signup links, and email confirmations.",
    bodyTail: "Verification-focused pages often perform well because they match strong user intent.",
  },
  {
    slug: "for-signup",
    label: "for Signup",
    descriptionTail: "Ideal for temporary account registration and signups.",
    bodyTail: "Signup intent is one of the strongest SEO categories for temporary email tools.",
  },
  {
    slug: "for-testing",
    label: "for Testing",
    descriptionTail: "Useful for QA, product testing, and workflow validation.",
    bodyTail: "Testing-related searches attract developers, QA teams, and users who need disposable inboxes.",
  },
  {
    slug: "no-signup",
    label: "No Signup",
    descriptionTail: "No registration required. Open and use instantly.",
    bodyTail: "No-signup search intent converts well because it promises speed and low friction.",
  },
  {
    slug: "online",
    label: "Online",
    descriptionTail: "Use it directly in your browser with no installation.",
    bodyTail: "Online temp mail tools perform well in search because they are fast, simple, and immediate.",
  },
  {
    slug: "free",
    label: "Free",
    descriptionTail: "Completely free to use with instant temporary inbox access.",
    bodyTail: "Free temp email queries are high-volume and often bring broad organic traffic.",
  }
];

const esBaseTopics: Topic[] = [
  {
    baseSlug: "correo-temporal",
    keyword: "correo temporal",
    titleBase: "Correo Temporal Gratis",
    descriptionBase: "Genera un correo temporal gratis al instante con Quantum Mail.",
    bodyBase: "El correo temporal ayuda a proteger tu bandeja principal y recibir mensajes sin exponer tu email real.",
  },
  {
    baseSlug: "email-temporal",
    keyword: "email temporal",
    titleBase: "Email Temporal",
    descriptionBase: "Crea un email temporal al instante para verificar cuentas y evitar spam.",
    bodyBase: "El email temporal es útil para registros rápidos, pruebas y privacidad online.",
  },
  {
    baseSlug: "correo-desechable",
    keyword: "correo desechable",
    titleBase: "Correo Desechable",
    descriptionBase: "Usa un correo desechable para registrarte sin compartir tu correo principal.",
    bodyBase: "Los correos desechables son muy útiles para formularios, registros y validaciones temporales.",
  },
  {
    baseSlug: "correo-anonimo",
    keyword: "correo anonimo",
    titleBase: "Correo Anónimo",
    descriptionBase: "Recibe mensajes con un correo anónimo temporal usando Quantum Mail.",
    bodyBase: "El correo anónimo ayuda a proteger tu identidad y mantener tu privacidad en internet.",
  },
  {
    baseSlug: "generador-email",
    keyword: "generador de email",
    titleBase: "Generador de Email Temporal",
    descriptionBase: "Quantum Mail funciona como generador de email temporal gratis.",
    bodyBase: "Un generador de email temporal crea bandejas rápidas para verificación, pruebas y uso desechable.",
  },
  {
    baseSlug: "email-temporal-gratis",
    keyword: "email temporal gratis",
    titleBase: "Email Temporal Gratis",
    descriptionBase: "Obtén un email temporal gratis y recibe mensajes al instante.",
    bodyBase: "El email temporal gratis es una de las herramientas más útiles para evitar spam y proteger tu correo real.",
  },
  {
    baseSlug: "correo-10-minutos",
    keyword: "correo 10 minutos",
    titleBase: "Correo de 10 Minutos",
    descriptionBase: "Genera un correo de 10 minutos para verificaciones rápidas.",
    bodyBase: "El correo de 10 minutos sirve para recibir mensajes rápidos y dejar que la bandeja expire automáticamente.",
  }
];

const esModifiers: Modifier[] = [
  {
    slug: "para-discord",
    label: "para Discord",
    descriptionTail: "Perfecto para verificaciones y registros temporales en Discord.",
    bodyTail: "Muchos usuarios buscan correo temporal para Discord para recibir códigos sin usar su correo personal.",
  },
  {
    slug: "para-instagram",
    label: "para Instagram",
    descriptionTail: "Útil para crear cuentas o verificar registros en Instagram.",
    bodyTail: "Instagram es una de las plataformas más buscadas junto con servicios de email temporal.",
  },
  {
    slug: "para-facebook",
    label: "para Facebook",
    descriptionTail: "Recibe correos de verificación de Facebook sin compartir tu email real.",
    bodyTail: "El correo temporal para Facebook es una búsqueda frecuente en usuarios que buscan privacidad.",
  },
  {
    slug: "para-verificacion",
    label: "para Verificación",
    descriptionTail: "Ideal para códigos, enlaces y correos de confirmación.",
    bodyTail: "La intención de verificación suele traer tráfico muy útil y bien orientado.",
  },
  {
    slug: "para-registro",
    label: "para Registro",
    descriptionTail: "Úsalo para registros rápidos en páginas web y apps.",
    bodyTail: "El correo temporal para registro es una de las búsquedas más naturales dentro de esta categoría.",
  },
  {
    slug: "gratis",
    label: "Gratis",
    descriptionTail: "Sin costo y disponible al instante desde tu navegador.",
    bodyTail: "Las búsquedas con la palabra gratis suelen tener alto volumen y buen potencial SEO.",
  },
  {
    slug: "sin-registro",
    label: "sin Registro",
    descriptionTail: "No requiere cuenta, instalación ni registro previo.",
    bodyTail: "Las herramientas sin registro suelen atraer usuarios por su rapidez y facilidad de uso.",
  },
  {
    slug: "online",
    label: "Online",
    descriptionTail: "Disponible online y lista para usar en segundos.",
    bodyTail: "La intención online suele funcionar bien porque promete acceso inmediato.",
  }
];

function createBaseRoutes(topics: Topic[], lang: "en" | "es"): SEORoute[] {
  return topics.map((topic) => ({
    slug: topic.baseSlug,
    lang,
    title: topic.titleBase,
    description: topic.descriptionBase,
    body: topic.bodyBase,
  }));
}

function createExpandedRoutes(
  topics: Topic[],
  modifiers: Modifier[],
  lang: "en" | "es"
): SEORoute[] {
  const routes: SEORoute[] = [];

  for (const topic of topics) {
    for (const modifier of modifiers) {
      routes.push({
        slug: `${topic.baseSlug}-${modifier.slug}`,
        lang,
        title: `${topic.titleBase} ${modifier.label}`,
        description: `${topic.descriptionBase} ${modifier.descriptionTail}`,
        body: `${topic.bodyBase} ${modifier.bodyTail}`,
      });
    }
  }

  return routes;
}

const manualExtraRoutes: SEORoute[] = [
  {
    slug: "temporary-inbox",
    lang: "en",
    title: "Temporary Inbox Online",
    description:
      "Create a temporary inbox online with Quantum Mail and receive messages instantly.",
    body:
      "Temporary inbox tools help users receive emails quickly without exposing a permanent address.",
  },
  {
    slug: "one-time-email",
    lang: "en",
    title: "One Time Email Address",
    description:
      "Use a one time email address for signups, verification, and disposable inbox access.",
    body:
      "One-time email pages match users who only need to receive one or two temporary messages.",
  },
  {
    slug: "throwaway-email",
    lang: "en",
    title: "Throwaway Email",
    description:
      "Generate a throwaway email address instantly with Quantum Mail.",
    body:
      "Throwaway email tools are commonly used for short-lived signups and quick web testing.",
  },
  {
    slug: "buzon-temporal",
    lang: "es",
    title: "Buzón Temporal",
    description:
      "Crea un buzón temporal para recibir mensajes sin comprometer tu correo personal.",
    body:
      "Un buzón temporal es útil para recibir verificaciones y mantener limpia tu bandeja principal.",
  },
  {
    slug: "correo-provisional",
    lang: "es",
    title: "Correo Provisional",
    description:
      "Consigue un correo provisional gratis para validaciones y registros rápidos.",
    body:
      "El correo provisional funciona muy bien para tareas puntuales donde no quieres usar tu email real.",
  },
  {
    slug: "email-anonimo",
    lang: "es",
    title: "Email Anónimo",
    description:
      "Crea un email anónimo temporal para recibir mensajes con más privacidad.",
    body:
      "El email anónimo ayuda a reducir spam y a proteger tu identidad al registrarte online.",
  }
];

export const seoRoutes: SEORoute[] = [
  ...createBaseRoutes(enBaseTopics, "en"),
  ...createExpandedRoutes(enBaseTopics, enModifiers, "en"),
  ...createBaseRoutes(esBaseTopics, "es"),
  ...createExpandedRoutes(esBaseTopics, esModifiers, "es"),
  ...manualExtraRoutes,
];

// elimina duplicados por slug por seguridad
export const uniqueSeoRoutes: SEORoute[] = Array.from(
  new Map(seoRoutes.map((route) => [route.slug, route])).values()
);
