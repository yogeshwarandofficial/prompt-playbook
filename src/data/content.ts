export type DomainKey = "web" | "cloud" | "app" | "ai" | "marketing";

export interface Domain {
  key: DomainKey;
  name: string;
  short: string;
  description: string;
  icon: string; // emoji fallback
  tutorials: number;
  duration: string;
  skills: string[];
}

export const DOMAINS: Domain[] = [
  {
    key: "web",
    name: "Web Development",
    short: "Web Dev",
    description: "Master frontend to backend and ship complete web applications.",
    icon: "🌐",
    tutorials: 24,
    duration: "4–6 Months",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    key: "cloud",
    name: "Cloud Computing (AWS)",
    short: "Cloud AWS",
    description: "Go from AWS fundamentals to architect-level production systems.",
    icon: "☁️",
    tutorials: 18,
    duration: "3–5 Months",
    skills: ["IAM", "EC2", "S3", "Lambda", "VPC", "Terraform"],
  },
  {
    key: "app",
    name: "App Development",
    short: "App Dev",
    description: "Build native and cross-platform mobile apps with Flutter & Kotlin.",
    icon: "📱",
    tutorials: 16,
    duration: "3–5 Months",
    skills: ["Dart", "Flutter", "Kotlin", "Firebase", "Jetpack Compose"],
  },
  {
    key: "ai",
    name: "AI & Automation",
    short: "AI",
    description: "Learn machine learning, modern AI tools, and workflow automation.",
    icon: "🤖",
    tutorials: 20,
    duration: "4–6 Months",
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "LangChain", "n8n"],
  },
  {
    key: "marketing",
    name: "Digital Marketing",
    short: "Marketing",
    description: "Master SEO, content, ads, and analytics for modern growth.",
    icon: "📈",
    tutorials: 14,
    duration: "2–3 Months",
    skills: ["SEO", "GA4", "Meta Ads", "Email", "Content"],
  },
];

export const DOMAIN_COLORS: Record<DomainKey, string> = {
  web: "var(--color-domain-web)",
  cloud: "var(--color-domain-cloud)",
  app: "var(--color-domain-app)",
  ai: "var(--color-domain-ai)",
  marketing: "var(--color-domain-marketing)",
};

export interface Roadmap {
  slug: string;
  domain: DomainKey;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner → Advanced";
  duration: string;
  prerequisites: string[];
  audience: string;
  tracks: { name: string; topics: string[] }[];
  projects: { title: string; description: string }[];
  resources: { label: string; url: string }[];
  careers: { role: string; salary: string }[];
}

export const ROADMAPS: Roadmap[] = [
  {
    slug: "full-stack-web-development",
    domain: "web",
    title: "Full Stack Web Development",
    description: "Master frontend to backend, build complete web applications, and deploy to the cloud.",
    difficulty: "Beginner → Advanced",
    duration: "4–6 months",
    prerequisites: ["Basic computer knowledge", "Curiosity to build things"],
    audience: "Students and freshers who want to become full-stack web developers.",
    tracks: [
      { name: "Beginner", topics: ["HTML semantics", "CSS & Flexbox/Grid", "JavaScript fundamentals", "Git & GitHub", "Responsive design"] },
      { name: "Intermediate", topics: ["React.js & hooks", "Node.js & Express", "REST APIs", "MongoDB", "Authentication"] },
      { name: "Advanced", topics: ["TypeScript", "Next.js / TanStack Start", "PostgreSQL", "Docker", "CI/CD", "Cloud deployment"] },
    ],
    projects: [
      { title: "Personal Portfolio", description: "Responsive portfolio with animated sections." },
      { title: "Todo App with Auth", description: "Full-stack CRUD with JWT login." },
      { title: "E-commerce Store", description: "Cart, checkout, and product catalog." },
      { title: "Blog Platform", description: "Markdown-powered blog with comments." },
      { title: "SaaS Dashboard", description: "Multi-tenant analytics dashboard." },
    ],
    resources: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { label: "React Docs", url: "https://react.dev" },
      { label: "Node.js Docs", url: "https://nodejs.org/en/docs" },
    ],
    careers: [
      { role: "Frontend Developer", salary: "₹4–10 LPA" },
      { role: "Backend Developer", salary: "₹5–12 LPA" },
      { role: "Full Stack Developer", salary: "₹6–15 LPA" },
    ],
  },
  {
    slug: "cloud-computing-aws",
    domain: "cloud",
    title: "Cloud Computing (AWS)",
    description: "Master AWS services from fundamentals to architect-level production deployments.",
    difficulty: "Intermediate",
    duration: "3–5 months",
    prerequisites: ["Basic Linux", "Networking concepts"],
    audience: "Developers and IT students transitioning into cloud engineering.",
    tracks: [
      { name: "Beginner", topics: ["AWS fundamentals", "IAM", "EC2", "S3", "VPC basics"] },
      { name: "Intermediate", topics: ["RDS", "Lambda", "API Gateway", "CloudFront", "Route 53"] },
      { name: "Advanced", topics: ["ECS / EKS", "CloudFormation", "Terraform", "Cost optimization", "Security best practices"] },
    ],
    projects: [
      { title: "Static Site on S3 + CloudFront", description: "Globally distributed static hosting." },
      { title: "Serverless API", description: "API Gateway + Lambda + DynamoDB." },
      { title: "3-tier Web App", description: "EC2 + RDS + Load Balancer." },
    ],
    resources: [
      { label: "AWS Docs", url: "https://docs.aws.amazon.com" },
      { label: "AWS Skill Builder", url: "https://skillbuilder.aws" },
    ],
    careers: [
      { role: "Cloud Engineer", salary: "₹6–14 LPA" },
      { role: "DevOps Engineer", salary: "₹7–18 LPA" },
      { role: "AWS Solutions Architect", salary: "₹10–25 LPA" },
    ],
  },
  {
    slug: "app-development",
    domain: "app",
    title: "App Development",
    description: "Build native and cross-platform mobile applications with Flutter and Kotlin.",
    difficulty: "Beginner → Advanced",
    duration: "3–5 months",
    prerequisites: ["Basic programming concepts"],
    audience: "Students aiming for mobile engineering roles.",
    tracks: [
      { name: "Flutter Track", topics: ["Dart basics", "Flutter widgets", "State management", "Firebase", "App deployment"] },
      { name: "Android Track", topics: ["Kotlin basics", "Android SDK", "Jetpack Compose", "Room DB", "API integration"] },
    ],
    projects: [
      { title: "Weather App", description: "API-driven weather with location services." },
      { title: "Chat App", description: "Realtime chat with Firebase." },
      { title: "E-commerce App", description: "Product catalog + cart." },
      { title: "Task Manager", description: "Offline-first todo with sync." },
    ],
    resources: [
      { label: "Flutter Docs", url: "https://docs.flutter.dev" },
      { label: "Android Developers", url: "https://developer.android.com" },
    ],
    careers: [
      { role: "Flutter Developer", salary: "₹4–12 LPA" },
      { role: "Android Developer", salary: "₹5–14 LPA" },
      { role: "Mobile Engineer", salary: "₹6–16 LPA" },
    ],
  },
  {
    slug: "ai-and-automation",
    domain: "ai",
    title: "AI & Automation",
    description: "Learn machine learning, modern AI tools, and workflow automation end-to-end.",
    difficulty: "Intermediate",
    duration: "4–6 months",
    prerequisites: ["Python basics", "Basic mathematics"],
    audience: "Developers and analysts entering AI / ML / automation.",
    tracks: [
      { name: "Beginner", topics: ["Python for AI", "NumPy", "Pandas", "Data visualization"] },
      { name: "Intermediate", topics: ["ML algorithms", "Scikit-learn", "NLP basics", "OpenAI API"] },
      { name: "Advanced", topics: ["LangChain", "AI agents", "Automation with n8n / Make", "Production deployment"] },
    ],
    projects: [
      { title: "Sentiment Analyzer", description: "Classify reviews with ML." },
      { title: "AI Chatbot", description: "RAG-powered Q&A bot." },
      { title: "Resume Screener", description: "LLM-driven candidate ranking." },
      { title: "Data Dashboard", description: "Interactive analytics view." },
    ],
    resources: [
      { label: "Scikit-learn Docs", url: "https://scikit-learn.org" },
      { label: "LangChain Docs", url: "https://python.langchain.com" },
    ],
    careers: [
      { role: "ML Engineer", salary: "₹8–22 LPA" },
      { role: "AI Engineer", salary: "₹10–28 LPA" },
      { role: "Automation Specialist", salary: "₹6–14 LPA" },
    ],
  },
  {
    slug: "digital-marketing",
    domain: "marketing",
    title: "Digital Marketing",
    description: "Master modern digital marketing strategies, tools, and measurable growth.",
    difficulty: "Beginner",
    duration: "2–3 months",
    prerequisites: ["None"],
    audience: "Anyone curious about marketing, content, or growth roles.",
    tracks: [
      { name: "Beginner", topics: ["Marketing fundamentals", "SEO basics", "Google Analytics 4"] },
      { name: "Intermediate", topics: ["Social media marketing", "Content marketing", "Email campaigns", "Google Ads"] },
      { name: "Advanced", topics: ["Funnel optimization", "Marketing automation", "Analytics dashboards", "ROI measurement"] },
    ],
    projects: [
      { title: "SEO Audit", description: "Full audit of a real website." },
      { title: "Social Media Campaign", description: "30-day Instagram growth plan." },
      { title: "Email Drip Sequence", description: "5-email onboarding flow." },
      { title: "Ad Campaign", description: "Meta Ads end-to-end setup." },
    ],
    resources: [
      { label: "Google Digital Garage", url: "https://learndigital.withgoogle.com" },
      { label: "Moz SEO Guide", url: "https://moz.com/beginners-guide-to-seo" },
    ],
    careers: [
      { role: "Digital Marketer", salary: "₹3–9 LPA" },
      { role: "SEO Specialist", salary: "₹4–10 LPA" },
      { role: "Growth Marketer", salary: "₹5–14 LPA" },
    ],
  },
];

export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  domain: DomainKey;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  tags: string[];
  body: string[];
}

export const TUTORIALS: Tutorial[] = [
  { slug: "react-hooks-in-15-minutes", title: "React Hooks in 15 Minutes", description: "A fast, practical tour of useState, useEffect, useMemo, and custom hooks with real examples.", domain: "web", difficulty: "Beginner", readMinutes: 12, tags: ["React", "Hooks", "Frontend"], body: ["Hooks let you use state and lifecycle without classes.", "Start with useState for local state, then graduate to useReducer for complex transitions.", "Custom hooks are just functions starting with 'use' — extract logic, share between components."] },
  { slug: "deploying-a-static-site-to-s3", title: "Deploying a Static Site to AWS S3", description: "Host a production-ready static site on S3 + CloudFront with a custom domain and HTTPS.", domain: "cloud", difficulty: "Beginner", readMinutes: 10, tags: ["AWS", "S3", "CloudFront"], body: ["Create a bucket with static website hosting enabled.", "Put a CloudFront distribution in front for global CDN + HTTPS.", "Use Route 53 to point your domain at the distribution."] },
  { slug: "flutter-state-management-101", title: "Flutter State Management 101", description: "Compare setState, Provider, and Riverpod with practical guidance on when to use each.", domain: "app", difficulty: "Intermediate", readMinutes: 14, tags: ["Flutter", "Dart", "State"], body: ["setState is great for local widget state.", "Provider works well for app-wide state with low ceremony.", "Riverpod adds compile-time safety and easier testing."] },
  { slug: "intro-to-langchain", title: "Intro to LangChain for AI Apps", description: "Build your first retrieval-augmented chatbot in under an hour with LangChain and OpenAI.", domain: "ai", difficulty: "Intermediate", readMinutes: 18, tags: ["AI", "LangChain", "Python"], body: ["LangChain chains together LLM calls, prompts, and tools.", "Use a vector store for retrieval-augmented generation.", "Wrap everything behind a simple FastAPI endpoint."] },
  { slug: "seo-essentials-2026", title: "SEO Essentials for 2026", description: "What still works in modern SEO: technical hygiene, content depth, and topical authority.", domain: "marketing", difficulty: "Beginner", readMinutes: 9, tags: ["SEO", "Content", "Growth"], body: ["Fix crawlability first — sitemaps, robots, internal links.", "Match content depth to search intent.", "Build topical clusters, not isolated articles."] },
  { slug: "typescript-for-react-devs", title: "TypeScript for React Devs", description: "A no-fluff guide to typing props, state, events, and async data in React.", domain: "web", difficulty: "Intermediate", readMinutes: 16, tags: ["TypeScript", "React"], body: ["Type props with interface, not type alias, for extensibility.", "useState infers — but be explicit for unions.", "Use generics for reusable hooks."] },
  { slug: "lambda-cold-starts-explained", title: "AWS Lambda Cold Starts Explained", description: "Why cold starts happen, how to measure them, and proven techniques to minimize impact.", domain: "cloud", difficulty: "Advanced", readMinutes: 11, tags: ["AWS", "Lambda", "Performance"], body: ["A cold start is the time to initialize a new execution environment.", "Provisioned Concurrency keeps environments warm.", "Smaller bundle = faster cold starts."] },
  { slug: "kotlin-coroutines-basics", title: "Kotlin Coroutines Basics", description: "Async programming on Android the modern way — suspend, scopes, dispatchers.", domain: "app", difficulty: "Intermediate", readMinutes: 13, tags: ["Kotlin", "Android"], body: ["Coroutines are lightweight threads suspended at await points.", "Use viewModelScope for lifecycle-aware async work.", "Pick dispatchers carefully — IO vs Default vs Main."] },
  { slug: "prompt-engineering-patterns", title: "Prompt Engineering Patterns That Actually Work", description: "Reusable patterns: role priming, few-shot, structured output, and self-critique.", domain: "ai", difficulty: "Beginner", readMinutes: 8, tags: ["AI", "Prompts", "LLM"], body: ["Set a clear role before the task.", "Few-shot beats zero-shot for structured tasks.", "Ask the model to critique its own output for higher quality."] },
  { slug: "google-analytics-4-quickstart", title: "Google Analytics 4 Quickstart", description: "Set up GA4 properly: events, conversions, audiences, and meaningful dashboards.", domain: "marketing", difficulty: "Beginner", readMinutes: 10, tags: ["GA4", "Analytics"], body: ["Plan your events before installing.", "Mark high-value events as conversions.", "Build audiences for retargeting."] },
  { slug: "docker-for-web-devs", title: "Docker for Web Developers", description: "Containerize a Node + React app with multi-stage builds and tiny production images.", domain: "web", difficulty: "Intermediate", readMinutes: 15, tags: ["Docker", "DevOps"], body: ["Multi-stage builds keep images lean.", "Use .dockerignore aggressively.", "Pin base image versions for reproducible builds."] },
  { slug: "scikit-learn-first-model", title: "Your First Scikit-learn Model", description: "From CSV to a trained classifier in under 30 lines of Python.", domain: "ai", difficulty: "Beginner", readMinutes: 12, tags: ["Python", "ML"], body: ["Load with Pandas, split with train_test_split.", "Fit a LogisticRegression baseline first.", "Evaluate with accuracy AND a confusion matrix."] },
];

export const TESTIMONIALS = [
  { name: "Aarav Sharma", college: "IIT Madras", quote: "The Web Dev roadmap took me from confused to confident. I shipped a real project and landed an internship.", rating: 5 },
  { name: "Priya Patel", college: "BITS Pilani", quote: "Loved how structured the AI roadmap is. The project ideas alone are worth gold.", rating: 5 },
  { name: "Rohan Mehta", college: "NIT Trichy", quote: "Free, focused, and actually useful. Way better than scattered YouTube playlists.", rating: 5 },
  { name: "Sneha Reddy", college: "VIT Vellore", quote: "I applied for the Cloud internship and got onboarded in two weeks. Highly recommend.", rating: 5 },
];

export const FAQS = [
  { q: "Is Infynux Academy really free?", a: "Yes — every roadmap, tutorial, and resource is free. We monetize through internship partnerships, not students." },
  { q: "How do I apply for an internship?", a: "Open the Internships page, pick a domain, click Apply Now, and fill out the short form. We respond within 2–3 business days." },
  { q: "Will I get a certificate?", a: "Yes — every completed internship comes with a verifiable certificate." },
  { q: "Is the internship remote?", a: "All internships are remote-first so you can work from anywhere in India." },
  { q: "Who can apply?", a: "School students, college students, and freshers. No prior experience required for entry-level domains." },
  { q: "What domains are available?", a: "Web Development, Cloud (AWS), App Development, AI & Automation, and Digital Marketing." },
  { q: "How long is the internship?", a: "Typically 4–8 weeks depending on the project and domain." },
  { q: "Do you provide mentorship?", a: "Yes — every intern is paired with a mentor for code reviews and weekly check-ins." },
];

export const SUBDOMAIN_GROUPS = [
  {
    label: "Web Development",
    options: ["Frontend & UI/UX", "Backend Development", "Full Stack Development"],
  },
  {
    label: "App Development",
    options: ["Flutter", "Android (Kotlin)"],
  },
  {
    label: "Cloud Computing",
    options: ["AWS"],
  },
  {
    label: "AI & Automation",
    options: ["AI & Automation"],
  },
  {
    label: "Digital Marketing",
    options: ["Digital Marketing"],
  },
];
