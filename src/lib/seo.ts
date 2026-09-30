export const SITE_URL = "https://www.infynuxacademy.in";
export const SITE_NAME = "Infynux Academy";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const ACADEMY_LOGO_URL = `${SITE_URL}/INfynux-Logo 1.png`;
export const GOOGLE_SITE_VERIFICATION = "Ma6YRQTl3lraifErr73MP_T7VPQpllsXy9FGWbEc8Gs";

import { EDUTECH_MASTER_KEYWORDS, formatKeywords } from "./seo-keywords";

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
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  keywords?: string | string[];
  category?: string;
  tags?: string[];
}

/**
 * Generate standard and EdTech-optimized SEO meta and link tags for TanStack Router head function
 */
export function createSeoHead({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
  author = SITE_NAME,
  noindex = false,
  keywords,
  category,
  tags,
}: MetaOptions) {
  const canonical = canonicalUrl(path);
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  // Format keyword string combining specific keywords with relevant master EdTech keywords
  const formattedKeywords = formatKeywords(keywords, tags, EDUTECH_MASTER_KEYWORDS.slice(0, 10));

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: formattedKeywords },
    { name: "author", content: author },
    { name: "theme-color", content: "#0A0A0A" },
    
    // EdTech Taxonomy & Semantic Crawling Tags
    { name: "classification", content: "Education, Technology, Programming, Developer Roadmaps, Internships" },
    { name: "subject", content: "Computer Science, Software Engineering, Web Development, Cloud Computing, Mobile Apps, AI" },
    { name: "audience", content: "Students, College Freshers, Software Engineers, Career Changers, Indian Tech Graduates" },
    { name: "coverage", content: "India, Worldwide" },
    { name: "distribution", content: "Global" },
    { name: "rating", content: "General" },
    { name: "revisit-after", content: "2 days" },

    // OpenGraph Tags
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical },
    { property: "og:image", content: absoluteImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: "en_IN" },
    { property: "og:keywords", content: formattedKeywords },

    // Twitter Card Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@infynux" },
    { name: "twitter:creator", content: "@infynux" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImage },
  ];

  if (category) {
    meta.push({ name: "category", content: category });
  }

  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" });
  }

  if (type === "article") {
    meta.push({ name: "news_keywords", content: formattedKeywords });
    if (publishedTime) {
      meta.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      meta.push({ property: "article:modified_time", content: modifiedTime });
    }
    meta.push({ property: "article:author", content: author });
    if (category) {
      meta.push({ property: "article:section", content: category });
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        meta.push({ property: "article:tag", content: tag });
      });
    }
  }

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: canonical },
  ];

  return { meta, links };
}

/**
 * Schema.org EducationalOrganization Structured Data
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
      caption: "Infynux Academy Logo",
    },
    slogan: "Free structured developer roadmaps, practical coding tutorials, and verifiable remote internships for students and freshers.",
    description: "India's premier free tech learning platform offering structured developer career roadmaps, hands-on programming tutorials, and verifiable remote internships for college students and freshers.",
    email: "support@infynuxsolutions.in",
    telephone: "+91-70108-50923",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Tamil Nadu",
    },
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
    knowsAbout: [
      "Computer Science",
      "Software Engineering",
      "Full Stack Web Development",
      "React.js",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Cloud Computing",
      "Amazon Web Services (AWS)",
      "AWS Solutions Architect",
      "Serverless Architecture",
      "Mobile App Development",
      "Flutter",
      "Dart",
      "Android Development with Kotlin",
      "Jetpack Compose",
      "Artificial Intelligence",
      "Machine Learning",
      "LangChain",
      "Generative AI & LLMs",
      "n8n Workflow Automation",
      "Technical SEO & Core Web Vitals",
      "Digital Marketing",
      "Google Analytics 4",
      "Video Editing with Premiere Pro",
      "DaVinci Resolve Color Grading",
      "Remote Tech Internships",
      "Student Credential Verification",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1480",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Infynux Academy Tech Curriculum",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Developer Roadmaps",
          description: "Free beginner-to-advanced learning tracks for software engineering careers.",
        },
        {
          "@type": "OfferCatalog",
          name: "Practical Programming Tutorials",
          description: "Step-by-step technical guides with code snippets and production deployments.",
        },
        {
          "@type": "OfferCatalog",
          name: "Remote Tech Internships",
          description: "Guided commercial project experience with mentor code reviews and verifiable certificates.",
        },
      ],
    },
  };
}

/**
 * Schema.org WebSite Structured Data with SearchAction
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
    inLanguage: ["en-IN", "en-US"],
    description: "Free tech learning roadmaps, practical programming tutorials, and remote internships for college students and freshers.",
    audience: {
      "@type": "Audience",
      audienceType: "College students, engineering graduates, self-taught developers, and tech career seekers",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tutorials?filter=all&q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
  modules?: Array<{
    phase: string;
    summary: string;
    topics: Array<{ name: string; lessons?: string[] }>;
  }>;
}) {
  const teachesList: string[] = [];
  if (roadmap.modules) {
    roadmap.modules.forEach((m) => {
      m.topics.forEach((t) => {
        teachesList.push(t.name);
      });
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonicalUrl(`/learn/${roadmap.slug}`)}/#course`,
    courseCode: `INFX-${roadmap.slug.toUpperCase()}`,
    name: `${roadmap.title} Roadmap`,
    description: roadmap.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    educationalLevel: roadmap.difficulty,
    timeRequired: roadmap.duration,
    coursePrerequisites: roadmap.prerequisites?.join("; ") || "Basic computer literacy and curiosity to code",
    audience: {
      "@type": "Audience",
      audienceType: roadmap.audience || "College students, engineering freshers, self-taught developers, and career switchers",
    },
    inLanguage: "en-IN",
    teaches: teachesList.length > 0 ? teachesList : [roadmap.title, "Practical Programming", "Industry Best Practices"],
    educationalCredentialAwarded: "Infynux Academy Certificate of Roadmap Completion",
    isAccessibleForFree: true,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "380",
      bestRating: "5",
      worstRating: "1",
    },
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
      instructor: {
        "@type": "Organization",
        name: "Infynux Academy Mentors",
      },
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
  domain?: string;
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
    inLanguage: "en-IN",
    datePublished: "2025-01-15T00:00:00+05:30",
    dateModified: "2026-03-26T00:00:00+05:30",
    proficiencyLevel: tutorial.difficulty || "Beginner",
    articleSection: tutorial.domain ? `${tutorial.domain.toUpperCase()} Development` : "Computer Science & Programming",
    keywords: tutorial.tags?.join(", ") || "programming, tech tutorials, developer guide",
    timeRequired: `PT${tutorial.readMinutes}M`,
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl(`/tutorials/${tutorial.slug}`),
    },
  };
}

/**
 * Schema.org FAQPage Structured Data (supports both question/answer and q/a formats)
 */
export function getFaqSchema(
  faqs: Array<{ question?: string; answer?: string; q?: string; a?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question || faq.q || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer || faq.a || "",
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
    description: "Industry-aligned remote tech internships for college students and freshers across Web Dev, Cloud AWS, App Dev, AI & Automation, Digital Marketing, and Video Editing with real client codebases, weekly mentor reviews, and verifiable certificates.",
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    timeToComplete: "P8W",
    programType: "Remote Internship",
    occupationalCategory: [
      "15-1252.00 - Software Developers",
      "15-1251.00 - Computer Programmers",
      "15-1243.00 - Database Architects",
      "15-1254.00 - Web Developers",
    ],
    programPrerequisites: "College students (B.Tech, BE, BCA, MCA, BSc CS), freshers, or self-taught developers with basic coding knowledge",
    educationalCredentialAwarded: "Verifiable Digital Internship Certificate & Experience Letter",
    teaches: [
      "Full Stack Web Development (React & Node.js)",
      "Cloud Architecture on Amazon Web Services (AWS)",
      "Cross-Platform Mobile App Development (Flutter)",
      "Native Android Development (Kotlin & Jetpack Compose)",
      "AI & Machine Learning Workflow Automation (Python & LangChain)",
      "Technical SEO and Performance Growth Marketing",
      "Professional Video Production and Color Grading",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.95",
      reviewCount: "890",
      bestRating: "5",
      worstRating: "1",
    },
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
