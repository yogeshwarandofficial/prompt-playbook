export const SITE_URL = "https://www.infynuxacademy.in";
export const SITE_NAME = "Infynux Academy";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-transparent.png`;
export const ACADEMY_LOGO_URL = `${SITE_URL}/INfynux-Logo 1.png`;
export const GOOGLE_SITE_VERIFICATION = "Ma6YRQTl3lraifErr73MP_T7VPQpllsXy9FGWbEc8Gs";

/**
 * Return strict HTTPS canonical URL without trailing slashes
 */
export function canonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") {
    return SITE_URL;
  }
  return `${SITE_URL}${cleanPath.replace(/\/+$/, "")}`;
}

export interface MetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
}

/**
 * Generate standard SEO meta and link tags for TanStack Router head function
 */
export function createSeoHead({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  author = SITE_NAME,
  noindex = false,
}: MetaOptions) {
  const canonical = canonicalUrl(path);
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "author", content: author },
    { name: "theme-color", content: "#0A0A0A" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical },
    { property: "og:image", content: absoluteImage },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@infynux" },
    { name: "twitter:creator", content: "@infynux" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImage },
  ];

  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" });
  }

  if (publishedTime) {
    meta.push({ property: "article:published_time", content: publishedTime });
    meta.push({ property: "article:author", content: author });
  }

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: canonical },
  ];

  return { meta, links };
}

/**
 * Schema.org Organization Structured Data
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "Infynux Academy",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: ACADEMY_LOGO_URL,
      width: "512",
      height: "512",
    },
    description: "Free structured tech learning roadmaps, practical tutorials, and verifiable remote internships for students and freshers in India.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-70108-50923",
      contactType: "customer support",
      email: "support@infynuxsolutions.in",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
    sameAs: [
      "https://www.instagram.com/infynuxacademy/",
      "https://linkedin.com/company/infynux-solutions/",
      "https://www.facebook.com/share/1BpJDJeTC2/",
      "https://www.youtube.com/@Infynuxsolutions",
      "https://whatsapp.com/channel/0029VbCVGAtBVJkxGWCc4002",
    ],
  };
}

/**
 * Schema.org WebSite Structured Data
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Infynux Academy",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
    description: "Free tech learning roadmaps, practical programming tutorials, and remote internships for college students and freshers.",
  };
}

/**
 * Schema.org BreadcrumbList Structured Data
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/**
 * Schema.org Course Structured Data for Roadmaps
 */
export function getCourseSchema(roadmap: {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  prerequisites?: string[];
  audience?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonicalUrl(`/learn/${roadmap.slug}`)}/#course`,
    name: `${roadmap.title} Roadmap`,
    description: roadmap.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    educationalLevel: roadmap.difficulty,
    timeRequired: roadmap.duration,
    coursePrerequisites: roadmap.prerequisites?.join("; ") || "Basic computer literacy",
    audience: {
      "@type": "Audience",
      audienceType: roadmap.audience || "Students, college freshers, and career changers",
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free",
      availability: "https://schema.org/InStock",
      url: canonicalUrl(`/learn/${roadmap.slug}`),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: roadmap.duration,
    },
  };
}

/**
 * Schema.org TechArticle Structured Data for Tutorials
 */
export function getArticleSchema(tutorial: {
  slug: string;
  title: string;
  description: string;
  readMinutes: number;
  tags?: string[];
  difficulty?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonicalUrl(`/tutorials/${tutorial.slug}`)}/#article`,
    headline: tutorial.title,
    description: tutorial.description,
    url: canonicalUrl(`/tutorials/${tutorial.slug}`),
    image: DEFAULT_OG_IMAGE,
    author: {
      "@type": "Organization",
      name: "Infynux Academy Editorial Team",
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en",
    datePublished: "2025-01-15T00:00:00+05:30",
    dateModified: "2026-03-26T00:00:00+05:30",
    proficiencyLevel: tutorial.difficulty || "Beginner",
    keywords: tutorial.tags?.join(", ") || "programming, tech tutorials",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl(`/tutorials/${tutorial.slug}`),
    },
  };
}

/**
 * Schema.org FAQPage Structured Data
 */
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Schema.org EducationalOccupationalProgram Structured Data for Internships
 */
export function getInternshipProgramSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "@id": `${canonicalUrl("/internships")}/#program`,
    name: "Infynux Academy Remote Tech Internship Program",
    description: "Industry-aligned remote tech internships for college students and freshers across Web Dev, Cloud AWS, App Dev, AI & Automation, and Digital Marketing with real client codebases and verifiable certificates.",
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    timeToComplete: "P6W",
    programType: "Remote Internship",
    educationalCredentialAwarded: "Verifiable Digital Internship Certificate",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free",
      availability: "https://schema.org/InStock",
      url: canonicalUrl("/internships"),
    },
  };
}
