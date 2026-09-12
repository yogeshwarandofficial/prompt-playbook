import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DOMAINS = [
  {
    key: "web",
    name: "Web Development",
    description: "Master frontend to backend and ship complete web applications.",
    duration: "4–6 Months",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    key: "cloud",
    name: "Cloud Computing (AWS)",
    description: "Go from AWS fundamentals to architect-level production systems.",
    duration: "3–5 Months",
    skills: ["IAM", "EC2", "S3", "Lambda", "VPC", "Terraform"],
  },
  {
    key: "app",
    name: "App Development",
    description: "Build native and cross-platform mobile apps with Flutter & Kotlin.",
    duration: "3–5 Months",
    skills: ["Dart", "Flutter", "Kotlin", "Firebase", "Jetpack Compose"],
  },
  {
    key: "ai",
    name: "AI & Automation",
    description: "Learn machine learning, modern AI tools, and workflow automation.",
    duration: "4–6 Months",
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "LangChain", "n8n"],
  },
  {
    key: "marketing",
    name: "Digital Marketing",
    description: "Master SEO, content, ads, and analytics for modern growth.",
    duration: "2–3 Months",
    skills: ["SEO", "GA4", "Meta Ads", "Email", "Content"],
  },
  {
    key: "video",
    name: "Video Editing",
    description: "Master video production, editing software, and storytelling techniques.",
    duration: "2–3 Months",
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading", "Audio Mixing"],
  },
];

async function main() {
  console.log('Starting seed...');
  for (const domain of DOMAINS) {
    const existing = await prisma.course.findUnique({
      where: { key: domain.key },
    });

    if (!existing) {
      await prisma.course.create({
        data: {
          key: domain.key,
          name: domain.name,
          description: domain.description,
          duration: domain.duration,
          skills: domain.skills,
        },
      });
      console.log(`Created course: ${domain.name}`);
    } else {
      console.log(`Course already exists, skipping: ${domain.name}`);
    }
  }
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
