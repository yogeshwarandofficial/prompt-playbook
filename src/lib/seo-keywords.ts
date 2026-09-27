/**
 * Infynux Academy — Comprehensive EdTech SEO Keyword Registry
 * Targeted for search engines (Google, Bing, Yahoo), AI assistants, and crawler taxonomy.
 * Categorized by Intent, Audience, Academic Qualification, Discipline, and Career Goals.
 */

export const EDUTECH_MASTER_KEYWORDS = [
  // Core EdTech & Online Learning Keywords
  "edtech platform",
  "edtech in india",
  "free online learning platform",
  "free tech education",
  "free coding courses with certificates",
  "computer science learning platform",
  "developer training platform",
  "engineering students tech portal",
  "free computer science courses",
  "learn to code online free",
  "programming learning paths",
  "structured coding curriculum",
  
  // Student & Fresher Career Keywords
  "tech jobs for freshers",
  "software engineering career paths",
  "college student career guidance",
  "btech cse career roadmaps 2026",
  "bca mca tech training",
  "bsc computer science job prep",
  "campus placement preparation",
  "technical interview preparation",
  "fresher resume building for tech",
  "github portfolio projects",
  "how to become a software engineer",
  
  // Remote Internships & Practical Experience
  "remote tech internships india",
  "virtual internships for college students",
  "free software engineering internship",
  "summer tech internship 2026",
  "winter tech internship for students",
  "aicte aligned internships",
  "internship with verifiable certificate",
  "live commercial projects",
  "industry mentor guidance",
  "remote coding internship with certificate",
  "verifiable digital credentials",
  "online internship certificate verification",

  // Core Disciplines
  "full stack web development",
  "cloud computing aws",
  "mobile app development flutter kotlin",
  "artificial intelligence and machine learning",
  "digital marketing and technical seo",
  "video editing and motion graphics"
];

export const ROADMAPS_PAGE_KEYWORDS = [
  "developer roadmaps 2026",
  "tech career roadmaps",
  "software engineer learning paths",
  "full stack developer roadmap",
  "aws cloud architect roadmap",
  "mobile app developer roadmap",
  "ai engineer roadmap 2026",
  "digital marketing learning path",
  "video editing production roadmap",
  "beginner to advanced programming syllabus",
  "computer science curriculum india",
  "self taught developer roadmap",
  "coding roadmap for college students",
  "step by step tech roadmap"
];

export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  web: [
    "full stack web development roadmap",
    "learn full stack developer 2026",
    "frontend developer roadmap",
    "backend developer roadmap",
    "mern stack course free",
    "learn react js step by step",
    "node js and express tutorial",
    "javascript fundamentals to advanced",
    "html5 css3 flexbox grid",
    "typescript for web developers",
    "rest api design and development",
    "mongodb database tutorial",
    "full stack developer syllabus for freshers",
    "web development capstone projects",
    "full stack developer salary india",
    "free web development certificate course"
  ],
  cloud: [
    "cloud aws roadmap 2026",
    "learn amazon web services free",
    "aws solutions architect associate roadmap",
    "cloud computing syllabus for freshers",
    "aws ec2 s3 lambda vpc tutorial",
    "cloud infrastructure and security",
    "serverless architecture on aws",
    "devops and cloud engineering",
    "terraform infrastructure as code",
    "aws certification roadmap for students",
    "cloud engineer job roles and salary",
    "hands on aws labs for beginners"
  ],
  app: [
    "mobile app development roadmap 2026",
    "learn flutter and dart from scratch",
    "native android development kotlin",
    "jetpack compose android tutorial",
    "cross platform mobile development",
    "firebase for mobile app developers",
    "state management in flutter bloc provider",
    "android app developer syllabus",
    "ios and android apps with single codebase",
    "mobile app portfolio projects for freshers",
    "flutter developer jobs and salary"
  ],
  ai: [
    "ai and automation roadmap 2026",
    "python for artificial intelligence",
    "machine learning roadmap for beginners",
    "generative ai and llm course free",
    "langchain python tutorial",
    "build autonomous ai agents",
    "n8n workflow automation guide",
    "prompt engineering and rag pipelines",
    "deep learning and neural networks",
    "ai engineer learning path for freshers",
    "data science and machine learning projects"
  ],
  marketing: [
    "digital marketing roadmap 2026",
    "technical seo training for developers",
    "google analytics ga4 tutorial",
    "meta ads and performance marketing",
    "content strategy and copywriting",
    "search engine optimization learning path",
    "conversion rate optimization cro",
    "email marketing automation",
    "growth hacking for startups",
    "digital marketing career for freshers"
  ],
  video: [
    "video editing roadmap 2026",
    "adobe premiere pro tutorial for beginners",
    "davinci resolve color grading masterclass",
    "after effects motion graphics",
    "youtube video editing course",
    "audio mixing and sound design",
    "freelance video editing roadmap",
    "visual storytelling techniques",
    "video production workflow for creators"
  ]
};

export const TUTORIALS_PAGE_KEYWORDS = [
  "free coding tutorials",
  "practical programming guides",
  "step by step developer tutorials",
  "react js tutorials",
  "aws deployment tutorial",
  "flutter mobile tutorials",
  "kotlin android compose guides",
  "langchain python ai examples",
  "technical seo audit tutorial",
  "n8n automation workflows",
  "clean code snippets and architectures",
  "real world software tutorials",
  "free developer documentation"
];

export const INTERNSHIPS_PAGE_KEYWORDS = [
  "remote tech internships india",
  "virtual internships for college students",
  "free software engineering internships",
  "web development remote internship",
  "cloud aws internship for freshers",
  "flutter app development internship",
  "python ai automation internship",
  "digital marketing remote internship",
  "btech cse summer internship 2026",
  "bca mca final year project internship",
  "aicte compliant student internship",
  "verifiable internship certificate",
  "experience letter for freshers",
  "industry mentor code reviews",
  "portfolio project internship",
  "online internship with offer letter"
];

export const VERIFY_PAGE_KEYWORDS = [
  "verify student certificate",
  "infynux academy credential verification",
  "online certificate validation tool",
  "verify internship certificate authenticity",
  "check student credential id",
  "digital credential verification portal",
  "qr code certificate verification"
];

export const CONTACT_PAGE_KEYWORDS = [
  "contact infynux academy",
  "student support infynux",
  "internship application inquiry",
  "college partnership and tech workshops",
  "hire trained freshers",
  "academic collaboration india"
];

export const EVENTS_PAGE_KEYWORDS = [
  "free tech webinars",
  "developer workshops india",
  "live coding masterclass",
  "aws cloud webinar for students",
  "full stack development bootcamps",
  "ai and automation workshops",
  "student hackathons and events"
];

/**
 * Helper to combine keyword lists into a clean, comma-separated string capped for meta headers.
 */
export function formatKeywords(...keywordArrays: (string[] | string | undefined)[]): string {
  const set = new Set<string>();
  
  for (const item of keywordArrays) {
    if (!item) continue;
    if (Array.isArray(item)) {
      item.forEach((k) => {
        const trimmed = k.trim().toLowerCase();
        if (trimmed) set.add(trimmed);
      });
    } else if (typeof item === "string") {
      item.split(",").forEach((k) => {
        const trimmed = k.trim().toLowerCase();
        if (trimmed) set.add(trimmed);
      });
    }
  }

  return Array.from(set).join(", ");
}
