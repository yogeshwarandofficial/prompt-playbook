export type DomainKey = "web" | "cloud" | "app" | "ai" | "marketing";

// Human-readable domain name type (used throughout pages)
export type Domain = "Web Development" | "Cloud AWS" | "App Development" | "AI & Automation" | "Digital Marketing";

// Mapping from DomainKey → Domain name
export const DOMAIN_NAME_MAP: Record<DomainKey, Domain> = {
  web: "Web Development",
  cloud: "Cloud AWS",
  app: "App Development",
  ai: "AI & Automation",
  marketing: "Digital Marketing",
};

// Array of Domain names for iteration
export const DOMAIN_LIST: Domain[] = [
  "Web Development",
  "Cloud AWS",
  "App Development",
  "AI & Automation",
  "Digital Marketing",
];

export interface DomainInfo {
  key: DomainKey;
  name: Domain;
  short: string;
  description: string;
  icon: string; // emoji fallback
  tutorials: number;
  duration: string;
  skills: string[];
}


export const DOMAINS: DomainInfo[] = [
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

export interface RoadmapLesson {
  name: string;
  lessons: string[];
  duration: string; // e.g. "1 week"
}

export interface RoadmapModule {
  phase: string; // "Beginner" | "Intermediate" | "Advanced"
  emoji: string;
  summary: string;
  topics: RoadmapLesson[];
}

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
  modules: RoadmapModule[];
  projects: { title: string; description: string; tech: string[] }[];
  resources: { label: string; url: string }[];
  careers: { role: string; salary: string; companies: string[] }[];
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
    modules: [
      {
        phase: "Beginner",
        emoji: "🌱",
        summary: "Build a rock-solid foundation in web fundamentals — HTML, CSS, JavaScript, and version control.",
        topics: [
          {
            name: "HTML & Web Fundamentals",
            duration: "1 week",
            lessons: ["Document structure & semantic tags", "Forms, inputs & validation", "Accessibility basics (ARIA, roles)", "SEO-friendly markup patterns"],
          },
          {
            name: "CSS & Layout",
            duration: "2 weeks",
            lessons: ["Box model & positioning", "Flexbox — 1D layouts", "CSS Grid — 2D layouts", "Custom properties (CSS variables)", "Responsive design & media queries", "Animations & transitions"],
          },
          {
            name: "JavaScript Fundamentals",
            duration: "3 weeks",
            lessons: ["Variables, types & operators", "Functions & scope", "Arrays & objects (ES6+)", "DOM manipulation", "Fetch API & async/await", "Error handling & debugging"],
          },
          {
            name: "Git & GitHub",
            duration: "1 week",
            lessons: ["Git init, add, commit, push", "Branching & merging", "Pull requests & code review", "Resolving merge conflicts"],
          },
        ],
      },
      {
        phase: "Intermediate",
        emoji: "⚡",
        summary: "Go full-stack with React on the frontend and Node + Express + MongoDB on the backend.",
        topics: [
          {
            name: "React.js & Hooks",
            duration: "3 weeks",
            lessons: ["JSX & component model", "useState & useEffect", "Props & component composition", "React Router v6", "Context API & useReducer", "Custom hooks & useMemo"],
          },
          {
            name: "Node.js & Express",
            duration: "2 weeks",
            lessons: ["Node.js event loop & modules", "Building REST APIs with Express", "Middleware & error handling", "File uploads with Multer", "Environment variables & config"],
          },
          {
            name: "MongoDB & Mongoose",
            duration: "1 week",
            lessons: ["NoSQL vs SQL concepts", "CRUD with Mongoose", "Schema design & validation", "Indexes & aggregation pipeline"],
          },
          {
            name: "Authentication & Security",
            duration: "1 week",
            lessons: ["JWT-based auth flow", "Password hashing with bcrypt", "HTTP-only cookies vs localStorage", "CORS, rate limiting & helmet.js"],
          },
        ],
      },
      {
        phase: "Advanced",
        emoji: "🚀",
        summary: "Level up to TypeScript, modern frameworks, databases, containers, and cloud deployment.",
        topics: [
          {
            name: "TypeScript",
            duration: "1 week",
            lessons: ["Types, interfaces & generics", "Typing React props & events", "Utility types & mapped types", "Strict mode & TSConfig"],
          },
          {
            name: "Next.js / TanStack Start",
            duration: "2 weeks",
            lessons: ["File-based routing & layouts", "Server-side rendering (SSR) & SSG", "API routes & server actions", "Optimistic UI & streaming"],
          },
          {
            name: "PostgreSQL & Prisma",
            duration: "1 week",
            lessons: ["Relational schema design", "SQL joins & transactions", "Prisma ORM — models & migrations", "Connection pooling & N+1 problem"],
          },
          {
            name: "Docker & CI/CD",
            duration: "1 week",
            lessons: ["Dockerfile & multi-stage builds", "docker-compose for local dev", "GitHub Actions CI pipeline", "Deploy to Render / Railway / AWS"],
          },
        ],
      },
    ],
    projects: [
      { title: "Personal Portfolio", description: "Responsive portfolio with animated sections and dark mode.", tech: ["HTML", "CSS", "JavaScript"] },
      { title: "Todo App with Auth", description: "Full-stack CRUD with JWT login and protected routes.", tech: ["React", "Node.js", "MongoDB"] },
      { title: "E-commerce Store", description: "Cart, checkout flow, Stripe payments, and admin panel.", tech: ["Next.js", "PostgreSQL", "Stripe"] },
      { title: "Blog Platform", description: "Markdown-powered blog with comments and SSR.", tech: ["TanStack Start", "Prisma", "PostgreSQL"] },
      { title: "SaaS Dashboard", description: "Multi-tenant analytics dashboard with auth and billing.", tech: ["React", "Node.js", "Supabase"] },
    ],
    resources: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { label: "React Docs", url: "https://react.dev" },
      { label: "Node.js Docs", url: "https://nodejs.org/en/docs" },
      { label: "The Odin Project", url: "https://www.theodinproject.com" },
      { label: "JavaScript.info", url: "https://javascript.info" },
    ],
    careers: [
      { role: "Frontend Developer", salary: "₹4–10 LPA", companies: ["Swiggy", "Zomato", "Razorpay", "startups"] },
      { role: "Backend Developer", salary: "₹5–12 LPA", companies: ["Flipkart", "Paytm", "Juspay", "startups"] },
      { role: "Full Stack Developer", salary: "₹6–15 LPA", companies: ["FAANG India", "Zerodha", "CRED", "startups"] },
    ],
  },
  {
    slug: "cloud-computing-aws",
    domain: "cloud",
    title: "Cloud Computing (AWS)",
    description: "Master AWS services from fundamentals to architect-level production deployments.",
    difficulty: "Intermediate",
    duration: "3–5 months",
    prerequisites: ["Basic Linux commands", "Networking concepts (IP, DNS, HTTP)"],
    audience: "Developers and IT students transitioning into cloud engineering.",
    tracks: [
      { name: "Beginner", topics: ["AWS fundamentals", "IAM", "EC2", "S3", "VPC basics"] },
      { name: "Intermediate", topics: ["RDS", "Lambda", "API Gateway", "CloudFront", "Route 53"] },
      { name: "Advanced", topics: ["ECS / EKS", "CloudFormation", "Terraform", "Cost optimization", "Security best practices"] },
    ],
    modules: [
      {
        phase: "Beginner",
        emoji: "☁️",
        summary: "Get comfortable with AWS core services, IAM, compute, and storage fundamentals.",
        topics: [
          {
            name: "AWS Fundamentals & IAM",
            duration: "1 week",
            lessons: ["Regions, AZs & the shared responsibility model", "IAM users, groups, roles & policies", "MFA & least-privilege principle", "AWS CLI setup & credentials"],
          },
          {
            name: "EC2 & Compute",
            duration: "1 week",
            lessons: ["Instance types & pricing models", "Security groups & key pairs", "Launch templates & user data scripts", "Elastic IPs & ELB basics"],
          },
          {
            name: "S3 & Storage",
            duration: "1 week",
            lessons: ["Bucket creation & object lifecycle", "Storage classes (Standard, IA, Glacier)", "Static website hosting", "Bucket policies & presigned URLs"],
          },
          {
            name: "VPC & Networking Basics",
            duration: "1 week",
            lessons: ["Subnets (public vs private)", "Internet gateway & NAT gateway", "Security groups vs NACLs", "VPC peering overview"],
          },
        ],
      },
      {
        phase: "Intermediate",
        emoji: "⚡",
        summary: "Add managed databases, serverless compute, CDN, and DNS to your AWS toolkit.",
        topics: [
          {
            name: "RDS & DynamoDB",
            duration: "1 week",
            lessons: ["RDS Multi-AZ vs read replicas", "Aurora vs standard RDS", "DynamoDB data modeling & GSIs", "Database encryption & backups"],
          },
          {
            name: "Lambda & Serverless",
            duration: "1 week",
            lessons: ["Lambda handler & execution model", "Event sources: S3, SQS, API Gateway", "Cold starts & provisioned concurrency", "Lambda layers & deployment packages"],
          },
          {
            name: "API Gateway & CloudFront",
            duration: "1 week",
            lessons: ["REST vs HTTP APIs in API Gateway", "Authorizers & usage plans", "CloudFront distributions & cache behaviors", "OAI / OAC for S3 origin security"],
          },
          {
            name: "Route 53 & ACM",
            duration: "3 days",
            lessons: ["DNS record types (A, CNAME, Alias)", "Routing policies (Latency, Failover, Weighted)", "ACM certificate provisioning", "Custom domain + CloudFront setup"],
          },
        ],
      },
      {
        phase: "Advanced",
        emoji: "🏗️",
        summary: "Container orchestration, infrastructure as code, cost management, and enterprise security.",
        topics: [
          {
            name: "ECS & EKS",
            duration: "2 weeks",
            lessons: ["Docker fundamentals recap", "ECS task definitions & services", "Fargate vs EC2 launch type", "EKS cluster setup & kubectl basics"],
          },
          {
            name: "CloudFormation & Terraform",
            duration: "1 week",
            lessons: ["CloudFormation stacks & change sets", "Terraform providers, state & modules", "IaC best practices & drift detection", "CI/CD for infrastructure with GitHub Actions"],
          },
          {
            name: "Cost Optimization & Security",
            duration: "1 week",
            lessons: ["AWS Cost Explorer & Budgets", "Reserved Instances vs Savings Plans", "GuardDuty, Security Hub & Config", "KMS encryption & Secrets Manager"],
          },
        ],
      },
    ],
    projects: [
      { title: "Static Site on S3 + CloudFront", description: "Globally distributed static hosting with custom domain and HTTPS.", tech: ["S3", "CloudFront", "Route 53", "ACM"] },
      { title: "Serverless REST API", description: "Full CRUD API with Lambda + API Gateway + DynamoDB.", tech: ["Lambda", "API Gateway", "DynamoDB"] },
      { title: "3-Tier Web App", description: "EC2 frontend, RDS backend, and an Application Load Balancer.", tech: ["EC2", "RDS", "ALB", "VPC"] },
      { title: "Containerized Microservice", description: "Docker app deployed on ECS Fargate with CI/CD.", tech: ["ECS", "ECR", "GitHub Actions"] },
    ],
    resources: [
      { label: "AWS Documentation", url: "https://docs.aws.amazon.com" },
      { label: "AWS Skill Builder", url: "https://skillbuilder.aws" },
      { label: "A Cloud Guru", url: "https://acloudguru.com" },
      { label: "Terraform Registry", url: "https://registry.terraform.io" },
    ],
    careers: [
      { role: "Cloud Engineer", salary: "₹6–14 LPA", companies: ["TCS", "Infosys", "Wipro", "AWS partners"] },
      { role: "DevOps Engineer", salary: "₹7–18 LPA", companies: ["Razorpay", "PhonePe", "Freshworks", "startups"] },
      { role: "AWS Solutions Architect", salary: "₹10–25 LPA", companies: ["Accenture", "Deloitte", "Capgemini", "FAANG India"] },
    ],
  },
  {
    slug: "app-development",
    domain: "app",
    title: "App Development",
    description: "Build native and cross-platform mobile applications with Flutter and Kotlin.",
    difficulty: "Beginner → Advanced",
    duration: "3–5 months",
    prerequisites: ["Basic programming concepts", "Logical thinking"],
    audience: "Students aiming for mobile engineering roles.",
    tracks: [
      { name: "Flutter Track", topics: ["Dart basics", "Flutter widgets", "State management", "Firebase", "App deployment"] },
      { name: "Android Track", topics: ["Kotlin basics", "Android SDK", "Jetpack Compose", "Room DB", "API integration"] },
    ],
    modules: [
      {
        phase: "Foundations",
        emoji: "📱",
        summary: "Learn the language and core widget system before writing your first app.",
        topics: [
          {
            name: "Dart Language Essentials",
            duration: "1 week",
            lessons: ["Variables, types & null safety", "Functions, closures & arrow syntax", "OOP: classes, mixins & interfaces", "async/await & Future & Stream"],
          },
          {
            name: "Flutter Widget System",
            duration: "2 weeks",
            lessons: ["Stateless vs Stateful widgets", "Layout widgets: Column, Row, Stack, Expanded", "Navigation & routing (go_router)", "Forms, input validation & gestures", "Theme & custom styling"],
          },
        ],
      },
      {
        phase: "Intermediate",
        emoji: "⚡",
        summary: "Master state management, API integration, and local storage.",
        topics: [
          {
            name: "State Management",
            duration: "2 weeks",
            lessons: ["setState — local state", "Provider — app-wide state", "Riverpod — type-safe state", "Bloc / Cubit pattern", "State persistence with Hydrated Bloc"],
          },
          {
            name: "Networking & APIs",
            duration: "1 week",
            lessons: ["http & dio packages", "JSON serialization with json_annotation", "Interceptors & error handling", "Caching & offline-first patterns"],
          },
          {
            name: "Local Storage & Databases",
            duration: "1 week",
            lessons: ["SharedPreferences for key-value", "SQLite with sqflite", "Hive — fast NoSQL", "Isar — reactive local DB"],
          },
        ],
      },
      {
        phase: "Advanced",
        emoji: "🚀",
        summary: "Firebase integration, native features, testing, and publishing to the app stores.",
        topics: [
          {
            name: "Firebase Integration",
            duration: "1 week",
            lessons: ["Firebase Auth (email, Google, Apple)", "Cloud Firestore real-time DB", "Firebase Storage for media", "Cloud Functions & FCM push notifications"],
          },
          {
            name: "Native Features & Plugins",
            duration: "1 week",
            lessons: ["Camera & photo picker", "GPS & Google Maps", "Bluetooth & sensors", "Platform channels (writing native code)"],
          },
          {
            name: "Testing & Publishing",
            duration: "1 week",
            lessons: ["Unit, widget & integration tests", "Flutter DevTools & performance profiling", "Android signing & Play Store upload", "iOS provisioning & App Store Connect"],
          },
        ],
      },
    ],
    projects: [
      { title: "Weather App", description: "Real-time weather with GPS location and 7-day forecast.", tech: ["Flutter", "OpenWeather API", "Riverpod"] },
      { title: "Chat App", description: "Realtime 1:1 and group chat with Firebase.", tech: ["Flutter", "Firebase", "Firestore"] },
      { title: "E-commerce App", description: "Product catalog, cart, wishlist, and Razorpay checkout.", tech: ["Flutter", "Firebase", "Razorpay"] },
      { title: "Task Manager", description: "Offline-first todo with Isar DB and background sync.", tech: ["Flutter", "Isar", "Riverpod"] },
    ],
    resources: [
      { label: "Flutter Documentation", url: "https://docs.flutter.dev" },
      { label: "Dart Language Tour", url: "https://dart.dev/language" },
      { label: "Android Developers", url: "https://developer.android.com" },
      { label: "pub.dev — Flutter Packages", url: "https://pub.dev" },
    ],
    careers: [
      { role: "Flutter Developer", salary: "₹4–12 LPA", companies: ["Dream11", "Meesho", "ShareChat", "startups"] },
      { role: "Android Developer", salary: "₹5–14 LPA", companies: ["Flipkart", "Ola", "Nykaa", "MakeMyTrip"] },
      { role: "Mobile Engineer", salary: "₹6–16 LPA", companies: ["FAANG India", "CRED", "Groww", "startups"] },
    ],
  },
  {
    slug: "ai-and-automation",
    domain: "ai",
    title: "AI & Automation",
    description: "Learn machine learning, modern AI tools, and workflow automation end-to-end.",
    difficulty: "Intermediate",
    duration: "4–6 months",
    prerequisites: ["Python 3.9+ basics", "Basic mathematics (algebra, statistics)"],
    audience: "Developers and analysts entering AI / ML / automation.",
    tracks: [
      { name: "Beginner", topics: ["Python for AI", "NumPy", "Pandas", "Data visualization"] },
      { name: "Intermediate", topics: ["ML algorithms", "Scikit-learn", "NLP basics", "OpenAI API"] },
      { name: "Advanced", topics: ["LangChain", "AI agents", "Automation with n8n / Make", "Production deployment"] },
    ],
    modules: [
      {
        phase: "Beginner",
        emoji: "🐍",
        summary: "Master Python data tools and learn to explore, clean, and visualize datasets.",
        topics: [
          {
            name: "Python for Data & AI",
            duration: "1 week",
            lessons: ["Python data structures & comprehensions", "File I/O & JSON handling", "Virtual environments & pip", "Jupyter notebooks & VS Code setup"],
          },
          {
            name: "NumPy & Pandas",
            duration: "2 weeks",
            lessons: ["ndarray — vectorized operations", "DataFrame: load, inspect & clean", "Handling missing values & outliers", "GroupBy, merge & pivot tables", "Time series basics"],
          },
          {
            name: "Data Visualization",
            duration: "1 week",
            lessons: ["Matplotlib — static charts", "Seaborn — statistical plots", "Plotly — interactive charts", "Choosing the right chart type"],
          },
        ],
      },
      {
        phase: "Intermediate",
        emoji: "🤖",
        summary: "Build and evaluate classical ML models, work with NLP, and call modern AI APIs.",
        topics: [
          {
            name: "Machine Learning Algorithms",
            duration: "2 weeks",
            lessons: ["Linear & logistic regression", "Decision trees & random forests", "SVM & k-NN", "Clustering: k-means, DBSCAN", "Model selection & cross-validation"],
          },
          {
            name: "Scikit-learn Pipelines",
            duration: "1 week",
            lessons: ["ColumnTransformer & Pipeline", "Feature engineering & encoding", "Hyperparameter tuning (GridSearch, Optuna)", "Model evaluation: confusion matrix, ROC-AUC", "Saving & loading models (joblib)"],
          },
          {
            name: "NLP & OpenAI API",
            duration: "2 weeks",
            lessons: ["Text preprocessing: tokenization, stemming, TF-IDF", "Sentiment analysis with VADER & Transformers", "OpenAI Chat Completions API", "Prompt design & structured output", "Embeddings & semantic similarity"],
          },
        ],
      },
      {
        phase: "Advanced",
        emoji: "🦾",
        summary: "Build RAG chatbots, autonomous AI agents, and no-code automation pipelines.",
        topics: [
          {
            name: "LangChain & RAG",
            duration: "2 weeks",
            lessons: ["Document loaders & text splitters", "Vector stores: Chroma, Pinecone, Weaviate", "Retrieval chains & RetrievalQA", "Memory: ConversationBufferMemory", "LCEL — LangChain Expression Language"],
          },
          {
            name: "AI Agents",
            duration: "1 week",
            lessons: ["ReAct agent pattern", "Tool use: web search, code execution", "LangGraph for stateful agents", "Human-in-the-loop patterns", "Evaluating agent outputs"],
          },
          {
            name: "Automation: n8n & Make",
            duration: "1 week",
            lessons: ["n8n workflows: triggers, nodes & conditions", "HTTP request nodes for AI API calls", "Webhook-driven automation", "Make (Integromat) scenarios", "Scheduling & error handling"],
          },
          {
            name: "Production Deployment",
            duration: "1 week",
            lessons: ["FastAPI for ML model serving", "Docker containerization for Python apps", "Modal / Replicate / Hugging Face Spaces", "Cost management & rate limiting", "Logging, monitoring & model versioning"],
          },
        ],
      },
    ],
    projects: [
      { title: "Sentiment Analyzer", description: "Classify customer reviews with a trained ML model and a web dashboard.", tech: ["Python", "Scikit-learn", "Streamlit"] },
      { title: "RAG Chatbot", description: "PDF Q&A bot with LangChain, Chroma, and an OpenAI backend.", tech: ["LangChain", "OpenAI", "FastAPI"] },
      { title: "Resume Screener", description: "LLM-driven candidate ranking from uploaded resumes.", tech: ["Python", "OpenAI", "Pandas"] },
      { title: "AI Automation Pipeline", description: "n8n workflow that monitors email → extracts data → calls AI → logs to sheets.", tech: ["n8n", "OpenAI API", "Google Sheets"] },
    ],
    resources: [
      { label: "Scikit-learn Docs", url: "https://scikit-learn.org" },
      { label: "LangChain Python Docs", url: "https://python.langchain.com" },
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
      { label: "fast.ai", url: "https://www.fast.ai" },
      { label: "OpenAI Platform Docs", url: "https://platform.openai.com/docs" },
    ],
    careers: [
      { role: "ML Engineer", salary: "₹8–22 LPA", companies: ["Google", "Microsoft", "Fractal Analytics", "Tiger Analytics"] },
      { role: "AI Engineer", salary: "₹10–28 LPA", companies: ["Sarvam AI", "Krutrim", "Ideaforge", "FAANG India"] },
      { role: "Automation Specialist", salary: "₹6–14 LPA", companies: ["Accenture", "Deloitte", "Zapier partners", "startups"] },
    ],
  },
  {
    slug: "digital-marketing",
    domain: "marketing",
    title: "Digital Marketing",
    description: "Master modern digital marketing strategies, tools, and measurable growth.",
    difficulty: "Beginner",
    duration: "2–3 months",
    prerequisites: ["None — just curiosity and a device with internet"],
    audience: "Anyone curious about marketing, content, or growth roles.",
    tracks: [
      { name: "Beginner", topics: ["Marketing fundamentals", "SEO basics", "Google Analytics 4"] },
      { name: "Intermediate", topics: ["Social media marketing", "Content marketing", "Email campaigns", "Google Ads"] },
      { name: "Advanced", topics: ["Funnel optimization", "Marketing automation", "Analytics dashboards", "ROI measurement"] },
    ],
    modules: [
      {
        phase: "Beginner",
        emoji: "📣",
        summary: "Understand how digital marketing works, set up analytics, and master SEO basics.",
        topics: [
          {
            name: "Marketing Fundamentals",
            duration: "1 week",
            lessons: ["Marketing vs advertising vs branding", "Customer journey & touchpoints", "AIDA model & conversion funnel", "Owned, earned & paid media", "Setting SMART marketing goals"],
          },
          {
            name: "SEO Fundamentals",
            duration: "2 weeks",
            lessons: ["How search engines crawl & index", "Keyword research (free tools)", "On-page SEO: titles, meta, headings", "Technical SEO: Core Web Vitals, sitemaps", "Link building basics & DA/DR", "Local SEO for businesses"],
          },
          {
            name: "Google Analytics 4",
            duration: "1 week",
            lessons: ["GA4 setup & Measurement ID", "Events, parameters & conversions", "Audience segments & exploration reports", "Funnel analysis", "Connecting GA4 to Google Ads"],
          },
        ],
      },
      {
        phase: "Intermediate",
        emoji: "📊",
        summary: "Launch social campaigns, write converting content, build email sequences, and run paid ads.",
        topics: [
          {
            name: "Social Media Marketing",
            duration: "2 weeks",
            lessons: ["Platform algorithms (Instagram, LinkedIn, X)", "Content calendar & batch creation", "Reels & short-form video strategy", "Community management & engagement", "Social listening tools"],
          },
          {
            name: "Content Marketing",
            duration: "1 week",
            lessons: ["Content strategy & pillar pages", "Blog writing for SEO", "Repurposing content across channels", "Content distribution & promotion", "Measuring content ROI"],
          },
          {
            name: "Email Marketing",
            duration: "1 week",
            lessons: ["List building & lead magnets", "Mailchimp / Brevo setup", "Welcome & drip sequences", "A/B testing subject lines", "Open rate, CTR & deliverability"],
          },
          {
            name: "Google & Meta Ads",
            duration: "1 week",
            lessons: ["Google Search & Display campaigns", "Keyword match types & Quality Score", "Meta Ads Manager — campaign structure", "Audience targeting: custom & lookalike", "Ad creative best practices & testing"],
          },
        ],
      },
      {
        phase: "Advanced",
        emoji: "🏆",
        summary: "Optimize funnels, automate campaigns, build dashboards, and prove marketing ROI.",
        topics: [
          {
            name: "Conversion Rate Optimization",
            duration: "1 week",
            lessons: ["A/B testing frameworks (Google Optimize / VWO)", "Landing page anatomy & heatmaps", "Form optimization & CTA copy", "User session recordings with Hotjar"],
          },
          {
            name: "Marketing Automation",
            duration: "1 week",
            lessons: ["HubSpot / ActiveCampaign basics", "Lead scoring models", "Trigger-based sequences", "CRM integration & deal pipelines"],
          },
          {
            name: "Analytics & ROI",
            duration: "1 week",
            lessons: ["Attribution models (last-click vs data-driven)", "Looker Studio dashboard building", "Customer Lifetime Value (CLV) calculation", "CAC, ROAS & payback period", "Reporting to stakeholders"],
          },
        ],
      },
    ],
    projects: [
      { title: "SEO Audit & Fix", description: "Full technical + content audit of a real website with an actionable fix list.", tech: ["Google Search Console", "Screaming Frog", "Ahrefs"] },
      { title: "Social Media Campaign", description: "30-day Instagram growth plan with content calendar and analytics report.", tech: ["Canva", "Meta Business Suite", "GA4"] },
      { title: "Email Drip Sequence", description: "5-email onboarding flow with A/B test results and open rate analysis.", tech: ["Mailchimp", "ConvertKit"] },
      { title: "Paid Ads Campaign", description: "End-to-end Meta Ads campaign with creative, targeting, and performance report.", tech: ["Meta Ads Manager", "Google Analytics 4"] },
    ],
    resources: [
      { label: "Google Digital Garage", url: "https://learndigital.withgoogle.com" },
      { label: "Moz Beginner's SEO Guide", url: "https://moz.com/beginners-guide-to-seo" },
      { label: "HubSpot Academy", url: "https://academy.hubspot.com" },
      { label: "Neil Patel Blog", url: "https://neilpatel.com/blog" },
    ],
    careers: [
      { role: "Digital Marketer", salary: "₹3–9 LPA", companies: ["D2C brands", "agencies", "e-commerce startups"] },
      { role: "SEO Specialist", salary: "₹4–10 LPA", companies: ["WittyFeed", "iProspect", "Dentsu", "agencies"] },
      { role: "Growth Marketer", salary: "₹5–14 LPA", companies: ["CRED", "Meesho", "Razorpay", "edtech startups"] },
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
  // Rich detail fields
  whatYouWillLearn: string[];
  prerequisites: string[];
  steps: { title: string; content: string }[];
  resources: { label: string; url: string }[];
}

export const TUTORIALS: Tutorial[] = [
  {
    slug: "react-hooks-in-15-minutes",
    title: "React Hooks in 15 Minutes",
    description: "A fast, practical tour of useState, useEffect, useMemo, and custom hooks with real examples.",
    domain: "web",
    difficulty: "Beginner",
    readMinutes: 12,
    tags: ["React", "Hooks", "Frontend"],
    body: ["Hooks let you use state and lifecycle without classes.", "Start with useState for local state, then graduate to useReducer for complex transitions.", "Custom hooks are just functions starting with 'use' — extract logic, share between components."],
    whatYouWillLearn: [
      "Use useState and useEffect correctly without pitfalls",
      "Optimize with useMemo and useCallback",
      "Write your own custom hooks to share logic",
      "Understand the rules of hooks and why they exist",
      "Migrate class components to functional components",
    ],
    prerequisites: ["Basic JavaScript (ES6+)", "Familiarity with React components and JSX"],
    steps: [
      {
        title: "1. useState — Local Component State",
        content: "useState returns a stateful value and a setter. Always treat state as immutable — never mutate it directly. For objects, spread the previous state and override only the changed field. React batches updates in event handlers, so multiple setState calls won't cause multiple re-renders.",
      },
      {
        title: "2. useEffect — Side Effects & Lifecycle",
        content: "useEffect runs after the browser paints. The dependency array controls when it re-runs: empty array = run once on mount, no array = run on every render, [dep] = run when dep changes. Always return a cleanup function when subscribing to events, intervals, or external data sources to prevent memory leaks.",
      },
      {
        title: "3. useMemo & useCallback — Performance",
        content: "useMemo caches an expensive computed value between renders. useCallback caches a function reference. Only use them when profiling shows a real slowdown — premature optimization adds complexity. The main use case is passing stable references to child components that are wrapped in React.memo.",
      },
      {
        title: "4. Custom Hooks — Reusable Logic",
        content: "A custom hook is simply a function whose name starts with 'use' and that calls other hooks. Extract repeated logic — data fetching, form state, local storage sync — into custom hooks. They make components thinner and logic independently testable. Examples: useLocalStorage, useFetch, useDebounce.",
      },
      {
        title: "5. Rules of Hooks",
        content: "Only call hooks at the top level of a function component or another hook — never inside loops, conditionals, or nested functions. React relies on the call order to associate state with the correct hook across renders. ESLint's eslint-plugin-react-hooks enforces these rules automatically.",
      },
    ],
    resources: [
      { label: "React Docs — Hooks Reference", url: "https://react.dev/reference/react" },
      { label: "Dan Abramov — A Complete Guide to useEffect", url: "https://overreacted.io/a-complete-guide-to-useeffect/" },
      { label: "React Patterns", url: "https://reactpatterns.com" },
    ],
  },
  {
    slug: "deploying-a-static-site-to-s3",
    title: "Deploying a Static Site to AWS S3",
    description: "Host a production-ready static site on S3 + CloudFront with a custom domain and HTTPS.",
    domain: "cloud",
    difficulty: "Beginner",
    readMinutes: 10,
    tags: ["AWS", "S3", "CloudFront"],
    body: ["Create a bucket with static website hosting enabled.", "Put a CloudFront distribution in front for global CDN + HTTPS.", "Use Route 53 to point your domain at the distribution."],
    whatYouWillLearn: [
      "Create and configure an S3 bucket for static hosting",
      "Set up a CloudFront distribution for global CDN delivery",
      "Configure HTTPS with AWS Certificate Manager",
      "Point a custom domain via Route 53",
      "Automate deployments with AWS CLI",
    ],
    prerequisites: ["An AWS account (free tier works)", "Basic terminal / CLI knowledge", "A built static site (HTML/CSS/JS or React build output)"],
    steps: [
      {
        title: "1. Create & Configure Your S3 Bucket",
        content: "Go to S3 → Create Bucket. Uncheck 'Block all public access'. Enable 'Static website hosting' under Properties and set index.html as the index document. Attach a bucket policy that grants s3:GetObject to everyone ('Principal': '*'). Upload your build files using the AWS console or: aws s3 sync ./dist s3://your-bucket-name --delete",
      },
      {
        title: "2. Request an SSL Certificate with ACM",
        content: "Navigate to AWS Certificate Manager in the us-east-1 region (required for CloudFront). Request a public certificate for your domain (e.g., yourdomain.com and *.yourdomain.com). Validate ownership via DNS by adding the CNAME record ACM provides. Certificate issuance takes 5–30 minutes.",
      },
      {
        title: "3. Create a CloudFront Distribution",
        content: "Create a CloudFront distribution. Set the Origin Domain to your S3 website endpoint (not the bucket ARN). Under Viewer Protocol Policy, select 'Redirect HTTP to HTTPS'. Attach the ACM certificate. Set Default Root Object to index.html. Deploy takes ~15 minutes globally.",
      },
      {
        title: "4. Connect Your Domain in Route 53",
        content: "In Route 53, select your hosted zone. Create an A record (Alias) pointing to your CloudFront distribution domain (e.g., d1234abcd.cloudfront.net). DNS propagation takes up to 48 hours but is usually live within minutes. Test with curl -I https://yourdomain.com to verify HTTPS.",
      },
      {
        title: "5. Automate Future Deployments",
        content: "Add a deploy script to your package.json: 'deploy': 'npm run build && aws s3 sync ./dist s3://your-bucket --delete && aws cloudfront create-invalidation --distribution-id YOUR_ID --paths /*'. The CloudFront invalidation clears cached files so visitors always get fresh content. Budget ~$0.50/month for this setup.",
      },
    ],
    resources: [
      { label: "AWS S3 Static Hosting Docs", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html" },
      { label: "CloudFront Getting Started", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html" },
      { label: "AWS CLI Reference", url: "https://awscli.amazonaws.com/v2/documentation/api/latest/index.html" },
    ],
  },
  {
    slug: "flutter-state-management-101",
    title: "Flutter State Management 101",
    description: "Compare setState, Provider, and Riverpod with practical guidance on when to use each.",
    domain: "app",
    difficulty: "Intermediate",
    readMinutes: 14,
    tags: ["Flutter", "Dart", "State"],
    body: ["setState is great for local widget state.", "Provider works well for app-wide state with low ceremony.", "Riverpod adds compile-time safety and easier testing."],
    whatYouWillLearn: [
      "Know when to use setState vs a state management library",
      "Wire up Provider for app-wide shared state",
      "Migrate to Riverpod for type-safe, testable state",
      "Avoid common pitfalls like rebuilding too many widgets",
      "Structure a Flutter app around clean state boundaries",
    ],
    prerequisites: ["Basic Dart syntax", "Familiarity with Flutter widgets and StatefulWidget"],
    steps: [
      {
        title: "1. setState — Widget-Local State",
        content: "setState is Flutter's built-in way to update a StatefulWidget. It triggers a rebuild of that widget's subtree. Use it only for state that is truly local to a single widget (e.g., whether a dropdown is open, a tab index, a text field value). If two widgets need the same state, lift it up or reach for a proper state solution.",
      },
      {
        title: "2. InheritedWidget — The Foundation",
        content: "Provider and Riverpod both build on InheritedWidget, Flutter's mechanism for passing data down the tree without manually threading it through constructors. Understanding InheritedWidget helps you debug why context.watch() triggers rebuilds. You rarely write InheritedWidget directly, but knowing it exists explains everything.",
      },
      {
        title: "3. Provider — Simple App-Wide State",
        content: "Wrap your MaterialApp with MultiProvider. Create a ChangeNotifier class for each domain of state. Use context.watch<T>() to rebuild on changes, context.read<T>() to call methods without subscribing. Provider is great for small to medium apps. Add provider: ^6.x to pubspec.yaml.",
      },
      {
        title: "4. Riverpod — Type-Safe & Testable",
        content: "Riverpod removes the BuildContext dependency for reading providers, making it fully testable in plain Dart. Define providers as top-level constants. Use ConsumerWidget instead of StatelessWidget. ref.watch() subscribes, ref.read() doesn't. StateNotifierProvider + StateNotifier replaces ChangeNotifier for more explicit state transitions.",
      },
      {
        title: "5. Choosing the Right Tool",
        content: "Single screen with isolated state → setState. Small app with a few shared values → Provider. Large app, teams, or needing testability → Riverpod. Avoid over-engineering: start simple and refactor when friction appears. Don't introduce BLoC or Redux unless the team is already familiar and the complexity justifies it.",
      },
    ],
    resources: [
      { label: "Flutter Docs — State Management", url: "https://docs.flutter.dev/data-and-backend/state-mgmt/intro" },
      { label: "Riverpod Official Docs", url: "https://riverpod.dev" },
      { label: "Provider Package", url: "https://pub.dev/packages/provider" },
    ],
  },
  {
    slug: "intro-to-langchain",
    title: "Intro to LangChain for AI Apps",
    description: "Build your first retrieval-augmented chatbot in under an hour with LangChain and OpenAI.",
    domain: "ai",
    difficulty: "Intermediate",
    readMinutes: 18,
    tags: ["AI", "LangChain", "Python"],
    body: ["LangChain chains together LLM calls, prompts, and tools.", "Use a vector store for retrieval-augmented generation.", "Wrap everything behind a simple FastAPI endpoint."],
    whatYouWillLearn: [
      "Understand LangChain's core abstractions: chains, prompts, and retrievers",
      "Build a RAG (Retrieval-Augmented Generation) pipeline",
      "Load and chunk documents into a vector store",
      "Query with semantic similarity search",
      "Wrap your chatbot in a FastAPI REST endpoint",
    ],
    prerequisites: ["Python 3.10+ installed", "An OpenAI API key", "pip / virtualenv basics"],
    steps: [
      {
        title: "1. Install LangChain & Dependencies",
        content: "Create a virtual environment and install: pip install langchain langchain-openai chromadb tiktoken fastapi uvicorn python-dotenv. Store your OPENAI_API_KEY in a .env file and load it with python-dotenv. LangChain's modular design means you install only what you need — swap OpenAI for any other LLM provider without changing your chain logic.",
      },
      {
        title: "2. Load & Chunk Your Documents",
        content: "Use LangChain's document loaders (PyPDFLoader, TextLoader, WebBaseLoader) to ingest your source data. Then split with RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50). Overlap ensures context isn't lost at chunk boundaries. The output is a list of Document objects with page_content and metadata.",
      },
      {
        title: "3. Embed & Store in Chroma",
        content: "Convert chunks to vector embeddings using OpenAIEmbeddings() and persist to Chroma (a local vector database). vectorstore = Chroma.from_documents(docs, embedding=OpenAIEmbeddings(), persist_directory='./chroma_db'). On subsequent runs, load with Chroma(persist_directory='./chroma_db', embedding_function=...) instead of re-embedding.",
      },
      {
        title: "4. Build the RAG Chain",
        content: "Create a retriever from the vector store: retriever = vectorstore.as_retriever(search_kwargs={'k': 4}). Build a RetrievalQA chain: qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(model='gpt-4o-mini'), chain_type='stuff', retriever=retriever). 'stuff' puts all retrieved chunks into one prompt — ideal for short contexts.",
      },
      {
        title: "5. Expose via FastAPI",
        content: "Create a FastAPI app with a POST /chat endpoint that accepts a query string and returns the answer. Run with uvicorn main:app --reload. Add streaming with StreamingResponse and LangChain's streaming callback handlers for a ChatGPT-like typing experience. This is production-ready with a simple gunicorn front in front.",
      },
    ],
    resources: [
      { label: "LangChain Python Docs", url: "https://python.langchain.com/docs/get_started/introduction" },
      { label: "Chroma Vector DB", url: "https://www.trychroma.com" },
      { label: "OpenAI API Docs", url: "https://platform.openai.com/docs" },
    ],
  },
  {
    slug: "seo-essentials-2026",
    title: "SEO Essentials for 2026",
    description: "What still works in modern SEO: technical hygiene, content depth, and topical authority.",
    domain: "marketing",
    difficulty: "Beginner",
    readMinutes: 9,
    tags: ["SEO", "Content", "Growth"],
    body: ["Fix crawlability first — sitemaps, robots, internal links.", "Match content depth to search intent.", "Build topical clusters, not isolated articles."],
    whatYouWillLearn: [
      "Audit and fix technical SEO issues that block rankings",
      "Write content that matches search intent at each funnel stage",
      "Build topical authority with content clusters",
      "Use Google Search Console to find quick wins",
      "Measure SEO performance with the right KPIs",
    ],
    prerequisites: ["Access to a website (any CMS)", "Google Search Console set up", "Basic understanding of what a webpage is"],
    steps: [
      {
        title: "1. Technical SEO Foundations",
        content: "Submit your sitemap.xml to Google Search Console. Check robots.txt isn't blocking important pages. Ensure every page has a unique, descriptive <title> and <meta description>. Fix broken internal links (404s). Achieve a Core Web Vitals 'Good' score — especially LCP < 2.5s and CLS < 0.1. Google won't rank pages it can't crawl or render.",
      },
      {
        title: "2. Keyword Research & Search Intent",
        content: "Use Google Search Console's Performance report to find queries you already rank for on pages 2–3 — these are your quickest wins. For new content, use free tools like Google's 'People also ask', Ahrefs free tier, or Semrush. Match intent: informational (how-to) → blog/guide, commercial (best X) → comparison page, transactional (buy X) → product/landing page.",
      },
      {
        title: "3. Content Depth & On-Page Optimization",
        content: "Analyze the top 5 results for your target keyword. Your content needs to cover every subtopic they cover, plus something unique. Use your primary keyword in the H1, first paragraph, and 2–3 subheadings naturally. Add FAQ sections (they win featured snippets). Aim for comprehensive, not just long — 1,500 quality words beats 5,000 padded words.",
      },
      {
        title: "4. Topical Authority — Content Clusters",
        content: "Pick one domain (e.g., 'email marketing') and create a pillar page plus 8–12 supporting articles on subtopics. Link all supporting articles to the pillar and back. Google's topic model rewards sites that cover a subject comprehensively. Don't spread thin across 20 topics — dominate 2–3 and expand from there.",
      },
      {
        title: "5. Measuring & Iterating",
        content: "Track: organic sessions, keyword rankings, click-through rate (CTR), and conversions from organic traffic. Update content every 6–12 months — freshness signals matter for many queries. Use Google Search Console's 'Queries' tab to find pages with high impressions but low CTR: rewrite their title tags and meta descriptions for better click rates.",
      },
    ],
    resources: [
      { label: "Google Search Central Docs", url: "https://developers.google.com/search/docs" },
      { label: "Moz Beginner's Guide to SEO", url: "https://moz.com/beginners-guide-to-seo" },
      { label: "Ahrefs SEO Blog", url: "https://ahrefs.com/blog" },
    ],
  },
  {
    slug: "typescript-for-react-devs",
    title: "TypeScript for React Devs",
    description: "A no-fluff guide to typing props, state, events, and async data in React.",
    domain: "web",
    difficulty: "Intermediate",
    readMinutes: 16,
    tags: ["TypeScript", "React"],
    body: ["Type props with interface, not type alias, for extensibility.", "useState infers — but be explicit for unions.", "Use generics for reusable hooks."],
    whatYouWillLearn: [
      "Type component props with interface and handle optional fields",
      "Use generics to build reusable components and hooks",
      "Correctly type DOM events, refs, and forms",
      "Handle async data with discriminated unions",
      "Set up a strict TypeScript config for React projects",
    ],
    prerequisites: ["JavaScript ES6+ (destructuring, spread, async/await)", "Basic React (components, hooks, props)", "TypeScript fundamentals (types, interfaces)"],
    steps: [
      {
        title: "1. Typing Component Props",
        content: "Define props with an interface, not inline. Use interface over type for props because interfaces are extensible with extends. Mark optional props with ?. For children, use React.ReactNode (accepts anything renderable). For event handlers, use React.MouseEventHandler<HTMLButtonElement> or inline (e: React.MouseEvent<HTMLButtonElement>) => void.",
      },
      {
        title: "2. useState & Discriminated Unions",
        content: "useState<T> infers from the initial value, but be explicit for unions: const [status, setStatus] = useState<'idle'|'loading'|'error'|'success'>('idle'). This creates a discriminated union — switch/case on status gives TypeScript full narrowing. Use a type with shape { status: 'error'; message: string } | { status: 'success'; data: T } to bundle related fields.",
      },
      {
        title: "3. Typing DOM Events & Forms",
        content: "For input onChange: (e: React.ChangeEvent<HTMLInputElement>) => void. For form onSubmit: (e: React.FormEvent<HTMLFormElement>) => void — call e.preventDefault() inside. For refs: const inputRef = useRef<HTMLInputElement>(null) — note the null initial value and the required null check before accessing inputRef.current?.focus().",
      },
      {
        title: "4. Generic Components & Hooks",
        content: "Generic components accept a type parameter: function List<T extends { id: string }>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }). Generic hooks let callers specify the return type: function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null }. This makes your utilities composable and type-safe.",
      },
      {
        title: "5. Strict Config & Common Pitfalls",
        content: "Enable strict: true in tsconfig.json — this catches the most bugs. Avoid casting with as unless you have no alternative (use type guards instead). Don't use any; prefer unknown and narrow it. Avoid React.FC for components — it hides the return type and adds implicit children. Use function declarations or const with an explicit return type annotation.",
      },
    ],
    resources: [
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app" },
      { label: "Total TypeScript", url: "https://www.totaltypescript.com" },
    ],
  },
  {
    slug: "lambda-cold-starts-explained",
    title: "AWS Lambda Cold Starts Explained",
    description: "Why cold starts happen, how to measure them, and proven techniques to minimize impact.",
    domain: "cloud",
    difficulty: "Advanced",
    readMinutes: 11,
    tags: ["AWS", "Lambda", "Performance"],
    body: ["A cold start is the time to initialize a new execution environment.", "Provisioned Concurrency keeps environments warm.", "Smaller bundle = faster cold starts."],
    whatYouWillLearn: [
      "Understand exactly what happens during a Lambda cold start",
      "Measure init duration in CloudWatch Logs",
      "Reduce cold start time with bundle optimization",
      "Use Provisioned Concurrency for latency-sensitive workloads",
      "Choose the right runtime for low-latency Lambda functions",
    ],
    prerequisites: ["Working knowledge of AWS Lambda", "Basic understanding of Node.js or Python runtimes", "CloudWatch Logs access"],
    steps: [
      {
        title: "1. What Is a Cold Start?",
        content: "When Lambda receives a request with no warm execution environment available, it must: download your deployment package, start the runtime (Node.js, Python, JVM, etc.), and run your initialization code outside the handler. This is the cold start. CloudWatch Logs report it as Init Duration. Subsequent requests reuse the warm environment and have no init cost.",
      },
      {
        title: "2. Measuring Cold Starts",
        content: "In CloudWatch Logs Insights: filter @type = 'REPORT' | stats avg(@initDuration), max(@initDuration), count(@initDuration) by bin(1h). The presence of initDuration in a log line means that invocation had a cold start. Use AWS X-Ray to visualize cold vs. warm latency in traces. Benchmark before optimizing — not every function has a cold start problem.",
      },
      {
        title: "3. Reduce Bundle Size",
        content: "Smaller ZIP = faster download + init. Use esbuild or webpack to tree-shake and bundle only what you need. Move dev dependencies out of production packages. For Node.js, avoid importing the entire AWS SDK v2 — use AWS SDK v3's modular client imports (@aws-sdk/client-s3) instead of the monolithic aws-sdk. Aim for < 5 MB unzipped.",
      },
      {
        title: "4. Move Work Outside the Handler",
        content: "SDK clients, DB connections, and config loaded outside the handler persist across warm invocations: const db = new DynamoDBClient({}); exports.handler = async (event) => { /* use db */ }. This shifts initialization cost to the cold start and amortizes it across many requests. Keep global state immutable or safely reset between invocations.",
      },
      {
        title: "5. Provisioned Concurrency",
        content: "Provisioned Concurrency pre-initializes a set number of environments so they're always warm. Configure it on a function alias or version. Cost: ~$0.015/GB-hour of provisioned concurrency plus normal invocation cost. Use Application Auto Scaling to schedule provisioned concurrency for predictable traffic peaks. For most workloads, a 200–500ms cold start is acceptable — quantify the business impact before paying for PC.",
      },
    ],
    resources: [
      { label: "AWS Lambda Performance Docs", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-performance-optimization.html" },
      { label: "Provisioned Concurrency Guide", url: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html" },
      { label: "Lumigo Cold Start Benchmark", url: "https://lumigo.io/aws-lambda-performance-optimization/lambda-cold-starts/" },
    ],
  },
  {
    slug: "kotlin-coroutines-basics",
    title: "Kotlin Coroutines Basics",
    description: "Async programming on Android the modern way — suspend, scopes, dispatchers.",
    domain: "app",
    difficulty: "Intermediate",
    readMinutes: 13,
    tags: ["Kotlin", "Android"],
    body: ["Coroutines are lightweight threads suspended at await points.", "Use viewModelScope for lifecycle-aware async work.", "Pick dispatchers carefully — IO vs Default vs Main."],
    whatYouWillLearn: [
      "Understand what coroutines are and why they replace AsyncTask",
      "Use suspend functions and launch / async builders",
      "Pick the right Dispatcher for each job",
      "Use viewModelScope and lifecycleScope safely",
      "Handle errors with try/catch and CoroutineExceptionHandler",
    ],
    prerequisites: ["Kotlin basics (data classes, lambdas, extension functions)", "Basic Android / ViewModel knowledge"],
    steps: [
      {
        title: "1. What Are Coroutines?",
        content: "Coroutines are suspendable computations. Unlike threads, they're lightweight — you can run thousands concurrently on a handful of OS threads. A suspend function can pause without blocking the thread, letting other work proceed. The Kotlin compiler transforms suspend functions into state machines under the hood. Add dependencies: implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.x'",
      },
      {
        title: "2. launch vs async",
        content: "launch starts a coroutine and returns a Job (fire-and-forget). async starts a coroutine and returns a Deferred<T> — await() the result when needed. Use launch for operations with no return value (writing to DB, logging). Use async + await when you need a result or want to run multiple operations concurrently and combine results.",
      },
      {
        title: "3. Dispatchers",
        content: "Dispatchers.Main: UI updates only — runs on the Android main thread. Dispatchers.IO: network calls, file/database I/O (optimized pool of 64 threads). Dispatchers.Default: CPU-intensive work (sorting, parsing). Switch with withContext(Dispatchers.IO) { ... } inside a coroutine without blocking. Never do network I/O on Dispatchers.Main.",
      },
      {
        title: "4. Structured Concurrency with Scopes",
        content: "Always launch coroutines in a scope. viewModelScope cancels all coroutines when the ViewModel is cleared — no memory leaks. lifecycleScope (in Activity/Fragment) respects the lifecycle. GlobalScope is almost always wrong — it ignores structured concurrency. If a child coroutine fails, the scope propagates the failure and cancels siblings.",
      },
      {
        title: "5. Error Handling",
        content: "Wrap suspend calls in try/catch just like synchronous code. For launch, unhandled exceptions propagate to the CoroutineExceptionHandler installed on the scope. For async, exceptions are thrown when you call await() — wrap that in try/catch. CancellationException is special — don't catch and swallow it, as that breaks cancellation. Rethrow it if you catch Throwable.",
      },
    ],
    resources: [
      { label: "Kotlin Coroutines Guide", url: "https://kotlinlang.org/docs/coroutines-guide.html" },
      { label: "Android Coroutines Best Practices", url: "https://developer.android.com/kotlin/coroutines/coroutines-best-practices" },
      { label: "Coroutines Codelab", url: "https://developer.android.com/codelabs/kotlin-coroutines" },
    ],
  },
  {
    slug: "prompt-engineering-patterns",
    title: "Prompt Engineering Patterns That Actually Work",
    description: "Reusable patterns: role priming, few-shot, structured output, and self-critique.",
    domain: "ai",
    difficulty: "Beginner",
    readMinutes: 8,
    tags: ["AI", "Prompts", "LLM"],
    body: ["Set a clear role before the task.", "Few-shot beats zero-shot for structured tasks.", "Ask the model to critique its own output for higher quality."],
    whatYouWillLearn: [
      "Apply role priming to set the model's persona and expertise",
      "Use few-shot examples to constrain output format",
      "Request structured output (JSON, tables, lists) reliably",
      "Implement self-critique loops for higher quality outputs",
      "Chain prompts for complex multi-step tasks",
    ],
    prerequisites: ["Access to an LLM API (OpenAI, Anthropic, Google, or similar)", "Basic understanding of what a language model is"],
    steps: [
      {
        title: "1. Role Priming",
        content: "Start your system prompt with a clear role: 'You are a senior backend engineer with 10 years of Python experience.' This primes the model's vocabulary, assumptions, and level of detail. Be specific — 'expert' is weaker than 'a staff engineer who has shipped Python microservices to millions of users'. Role priming is especially powerful for domain-specific tasks like medical, legal, or engineering queries.",
      },
      {
        title: "2. Few-Shot Examples",
        content: "Provide 2–5 input/output pairs before the actual task. The model pattern-matches and applies your examples' format, tone, and level of detail. For classification: Input: 'My order arrived broken.' → Category: 'Damaged Goods'. Use at least 2 examples per class. For generation, examples constrain length, structure, and vocabulary better than instructions alone.",
      },
      {
        title: "3. Structured Output",
        content: "Ask for JSON, Markdown tables, or numbered lists explicitly and show the schema. 'Respond ONLY with valid JSON matching this schema: { name: string, score: number, reason: string }'. For APIs, use OpenAI's response_format: { type: 'json_object' } or Anthropic's structured output feature to guarantee parseable responses. Never rely on post-processing to fix malformed output.",
      },
      {
        title: "4. Self-Critique Loops",
        content: "After generating a first draft, prompt the model: 'Review the above output. List any factual errors, logical gaps, or missing edge cases. Then provide an improved version.' This two-step process consistently produces higher quality results than a single prompt. Automate it in code: generate → critique → regenerate. Three iterations is usually sufficient.",
      },
      {
        title: "5. Prompt Chaining for Complex Tasks",
        content: "Break multi-step tasks into a pipeline of focused prompts. Step 1: Extract key facts from a document. Step 2: Generate a summary using the extracted facts. Step 3: Translate the summary. Each prompt is simpler, easier to test, and failures are isolatable. Use LangChain's SequentialChain or hand-roll the pipeline with a loop and structured data passed between steps.",
      },
    ],
    resources: [
      { label: "OpenAI Prompt Engineering Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" },
      { label: "Anthropic Prompt Library", url: "https://docs.anthropic.com/en/prompt-library/library" },
      { label: "Learn Prompting (Open Source)", url: "https://learnprompting.org" },
    ],
  },
  {
    slug: "google-analytics-4-quickstart",
    title: "Google Analytics 4 Quickstart",
    description: "Set up GA4 properly: events, conversions, audiences, and meaningful dashboards.",
    domain: "marketing",
    difficulty: "Beginner",
    readMinutes: 10,
    tags: ["GA4", "Analytics"],
    body: ["Plan your events before installing.", "Mark high-value events as conversions.", "Build audiences for retargeting."],
    whatYouWillLearn: [
      "Create a GA4 property and install the tracking code",
      "Design a meaningful event taxonomy before going live",
      "Mark high-value actions as conversions",
      "Build audiences for remarketing in Google Ads",
      "Create an Exploration report to analyze user funnels",
    ],
    prerequisites: ["A Google account", "Access to your website's HTML or CMS", "A Google Ads account (optional, for audiences)"],
    steps: [
      {
        title: "1. Create a GA4 Property",
        content: "In Google Analytics, click Admin → Create Property → select GA4. Add a Web Data Stream with your site URL. Copy the Measurement ID (G-XXXXXXXXXX). Install via Google Tag Manager (recommended) or paste the gtag snippet directly into your <head>. Verify installation in GA4's Realtime report — visit your site and confirm an active user appears.",
      },
      {
        title: "2. Plan Your Event Taxonomy",
        content: "GA4 auto-collects page_view, scroll, click, and session_start. Before adding custom events, map your business goals to events. Example for an academy: tutorial_started, tutorial_completed, internship_applied, newsletter_subscribed. Use snake_case names, keep parameters under 25 per event, and document everything in a tracking plan spreadsheet before implementing.",
      },
      {
        title: "3. Implement Custom Events",
        content: "Fire custom events with gtag('event', 'tutorial_completed', { tutorial_id: 'react-hooks', domain: 'web' }) or via GTM's Custom Event trigger. For link clicks, use GTM's Click trigger with a Variable that captures the destination URL. Test every event in GA4 DebugView (enable with ?gtm_debug=1 in your URL) before marking the implementation as done.",
      },
      {
        title: "4. Mark Conversions & Build Audiences",
        content: "In GA4 → Admin → Events, toggle key events (e.g., internship_applied) to 'Mark as conversion'. In Audiences, create segments like 'Viewed 3+ tutorials but not applied' — these are warm leads. Export audiences to Google Ads for remarketing campaigns. GA4 audiences update daily and apply to future sessions, not historical data.",
      },
      {
        title: "5. Build a Funnel Exploration",
        content: "Go to Explore → Funnel Exploration. Define steps: 1. page_view (tutorials page) → 2. tutorial_started → 3. tutorial_completed → 4. internship_applied. GA4 shows drop-off at each step. Segment by device, source, or user property to find where mobile users drop more than desktop. Use this data to prioritize UX fixes.",
      },
    ],
    resources: [
      { label: "GA4 Help Center", url: "https://support.google.com/analytics/answer/10089681" },
      { label: "GA4 Event Reference", url: "https://developers.google.com/analytics/devguides/collection/ga4/reference/events" },
      { label: "Measurement Academy", url: "https://analytics.google.com/analytics/academy/" },
    ],
  },
  {
    slug: "docker-for-web-devs",
    title: "Docker for Web Developers",
    description: "Containerize a Node + React app with multi-stage builds and tiny production images.",
    domain: "web",
    difficulty: "Intermediate",
    readMinutes: 15,
    tags: ["Docker", "DevOps"],
    body: ["Multi-stage builds keep images lean.", "Use .dockerignore aggressively.", "Pin base image versions for reproducible builds."],
    whatYouWillLearn: [
      "Write a production-grade multi-stage Dockerfile",
      "Use .dockerignore to keep builds fast and images small",
      "Compose a full Node + React stack with docker-compose",
      "Debug running containers with exec and logs",
      "Push images to Docker Hub or a private registry",
    ],
    prerequisites: ["Node.js basics", "Terminal comfort (cd, ls, mkdir)", "Docker Desktop installed"],
    steps: [
      {
        title: "1. Your First Dockerfile",
        content: "Create a Dockerfile at the project root. Start with FROM node:20-alpine (Alpine = tiny base image). Set WORKDIR /app. COPY package*.json ./ then RUN npm ci --only=production (not npm install — ci is deterministic). COPY . . then EXPOSE 3000 and CMD ['node', 'server.js']. Build with docker build -t myapp:latest . and run with docker run -p 3000:3000 myapp:latest.",
      },
      {
        title: "2. Multi-Stage Builds",
        content: "Stage 1 (builder): FROM node:20 AS builder — install all deps and run the React build. Stage 2 (runtime): FROM node:20-alpine — copy only the build output and production deps from the builder stage. COPY --from=builder /app/dist ./dist. Result: a production image with no dev tools, no source maps, no node_modules bloat. Typically reduces image size from 1.5GB to 150MB.",
      },
      {
        title: "3. .dockerignore",
        content: "Add .dockerignore alongside .gitignore. Include: node_modules, .git, .env, dist, *.log, .DS_Store, coverage. Without this, Docker's build context uploads your entire node_modules on every build — often 500MB+. With .dockerignore, the context is usually < 1MB. This dramatically speeds up builds and prevents secrets from leaking into images.",
      },
      {
        title: "4. Docker Compose for Local Dev",
        content: "Create docker-compose.yml: define a web service (your Node app), a db service (postgres:16-alpine), and an optional redis service. Mount your source with volumes: - .:/app:delegated for hot reload. Use environment variables from a .env file with env_file: .env. Run docker compose up -d to start everything. docker compose logs -f web to tail logs.",
      },
      {
        title: "5. Push to a Registry & Deploy",
        content: "Tag your image: docker tag myapp:latest yourusername/myapp:v1.0.0. Push: docker push yourusername/myapp:v1.0.0. On your server: docker pull yourusername/myapp:v1.0.0 && docker run -d -p 80:3000 --env-file .env yourusername/myapp:v1.0.0. Use a private registry (ECR, GCR, or GHCR) for production. Set up a GitHub Actions workflow to build and push automatically on every push to main.",
      },
    ],
    resources: [
      { label: "Docker Official Docs", url: "https://docs.docker.com" },
      { label: "Docker Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/" },
      { label: "Play with Docker", url: "https://labs.play-with-docker.com" },
    ],
  },
  {
    slug: "scikit-learn-first-model",
    title: "Your First Scikit-learn Model",
    description: "From CSV to a trained classifier in under 30 lines of Python.",
    domain: "ai",
    difficulty: "Beginner",
    readMinutes: 12,
    tags: ["Python", "ML"],
    body: ["Load with Pandas, split with train_test_split.", "Fit a LogisticRegression baseline first.", "Evaluate with accuracy AND a confusion matrix."],
    whatYouWillLearn: [
      "Load and explore a dataset with Pandas",
      "Preprocess features with Scikit-learn pipelines",
      "Train and evaluate a classification model",
      "Interpret a confusion matrix and classification report",
      "Save and load a trained model with joblib",
    ],
    prerequisites: ["Python 3.9+ installed", "pip install pandas scikit-learn matplotlib", "Basic Python (lists, dicts, functions)"],
    steps: [
      {
        title: "1. Load & Explore the Data",
        content: "import pandas as pd; df = pd.read_csv('data.csv'). Run df.head(), df.info(), df.describe(), and df.isnull().sum() to understand shape, types, and missing values. For a classification task, check class balance: df['target'].value_counts(). Imbalanced classes (90:10) require stratified splitting and adjusted metrics — don't just optimize for accuracy.",
      },
      {
        title: "2. Preprocess with a Pipeline",
        content: "Use ColumnTransformer + Pipeline to avoid data leakage: numeric features → SimpleImputer(strategy='median') + StandardScaler. Categorical features → SimpleImputer(strategy='most_frequent') + OneHotEncoder(handle_unknown='ignore'). Wrap the preprocessor and model in a Pipeline so fit/transform always applies to train data only. This is the most common source of bugs in ML projects.",
      },
      {
        title: "3. Split & Train",
        content: "from sklearn.model_selection import train_test_split; X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y). Always set random_state for reproducibility. Train a Logistic Regression baseline first: model.fit(X_train, y_train). A simple model that works beats a complex model that's wrong.",
      },
      {
        title: "4. Evaluate Properly",
        content: "from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay. Print classification_report(y_test, model.predict(X_test)) — this shows precision, recall, and F1 per class. Plot the confusion matrix to see which classes are confused. If precision is your concern (spam filter), optimize for it. If recall (cancer detection), optimize for that. Accuracy alone is misleading for imbalanced data.",
      },
      {
        title: "5. Save & Load the Model",
        content: "import joblib; joblib.dump(model, 'model.pkl'). Load later with: model = joblib.load('model.pkl'). Because the Pipeline includes the preprocessor, you just call model.predict(new_data) without re-applying transformations manually. Version your model files alongside your code. For production, consider MLflow or a model registry instead of raw pickle files.",
      },
    ],
    resources: [
      { label: "Scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
      { label: "Kaggle Learn — ML Intro", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
      { label: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
    ],
  },
];



export const TESTIMONIALS = [
  { name: "Aarav Sharma", college: "IIT Madras", stars: 5, quote: "The Web Dev roadmap took me from confused to confident. I shipped a real project and landed an internship." },
  { name: "Priya Patel", college: "BITS Pilani", stars: 5, quote: "Loved how structured the AI roadmap is. The project ideas alone are worth gold." },
  { name: "Rohan Mehta", college: "NIT Trichy", stars: 5, quote: "Free, focused, and actually useful. Way better than scattered YouTube playlists." },
  { name: "Sneha Reddy", college: "VIT Vellore", stars: 5, quote: "I applied for the Cloud internship and got onboarded in two weeks. Highly recommend." },
];

export const FAQS = [
  { question: "Is Infynux Academy really free?", answer: "Yes — every roadmap, tutorial, and resource is free. We monetize through internship partnerships, not students." },
  { question: "How do I apply for an internship?", answer: "Open the Internships page, pick a domain, click Apply Now, and fill out the short form. We respond within 2–3 business days." },
  { question: "Will I get a certificate?", answer: "Yes — every completed internship comes with a verifiable certificate." },
  { question: "Is the internship remote?", answer: "All internships are remote-first so you can work from anywhere in India." },
  { question: "Who can apply?", answer: "School students, college students, and freshers. No prior experience required for entry-level domains." },
  { question: "What domains are available?", answer: "Web Development, Cloud (AWS), App Development, AI & Automation, and Digital Marketing." },
  { question: "How long is the internship?", answer: "Typically 4–8 weeks depending on the project and domain." },
  { question: "Do you provide mentorship?", answer: "Yes — every intern is paired with a mentor for code reviews and weekly check-ins." },
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
