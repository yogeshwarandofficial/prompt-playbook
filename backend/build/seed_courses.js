"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '.env') });
const prisma = new client_1.PrismaClient();
const courses = [
    {
        key: 'web',
        name: 'Web Development',
        description: 'Master frontend to backend and ship complete web applications.',
        duration: '4-8 weeks',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
        image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_9_2026_11_32_31_AM',
    },
    {
        key: 'cloud',
        name: 'Cloud Computing (AWS)',
        description: 'Go from AWS fundamentals to architect-level production systems.',
        duration: '4-8 weeks',
        skills: ['IAM', 'EC2', 'S3', 'Lambda', 'VPC', 'Terraform'],
        image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/v1788934312/ChatGPT_Image_Sep_9_2026_11_41_38_AM.png',
    },
    {
        key: 'app',
        name: 'App Development',
        description: 'Build native and cross-platform mobile apps with Flutter & Kotlin.',
        duration: '4-8 weeks',
        skills: ['Dart', 'Flutter', 'Kotlin', 'Firebase', 'Jetpack Compose'],
        image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/v1788934427/ChatGPT_Image_Sep_9_2026_11_43_43_AM.png',
    },
    {
        key: 'ai',
        name: 'AI & Automation',
        description: 'Learn machine learning, modern AI tools, and workflow automation.',
        duration: '4-8 weeks',
        skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'LangChain', 'n8n'],
        image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935578/ChatGPT_Image_Sep_9_2026_12_00_14_PM_2.png',
    },
    {
        key: 'marketing',
        name: 'Digital Marketing',
        description: 'Master SEO, content, ads, and analytics for modern growth.',
        duration: '4-8 weeks',
        skills: ['SEO', 'GA4', 'Meta Ads', 'Email', 'Content'],
        image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935575/ChatGPT_Image_Sep_9_2026_12_00_15_PM_3.png',
    },
    {
        key: 'video',
        name: 'Video Editing',
        description: 'Master video production, editing software, and storytelling techniques.',
        duration: '4-8 weeks',
        skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading', 'Audio Mixing'],
        image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935577/ChatGPT_Image_Sep_9_2026_12_00_15_PM_4.png',
    }
];
async function main() {
    console.log('Seeding courses...');
    for (const course of courses) {
        const upserted = await prisma.course.upsert({
            where: { key: course.key },
            update: {
                name: course.name,
                description: course.description,
                duration: course.duration,
                skills: course.skills,
                image: course.image,
            },
            create: course,
        });
        console.log(`Upserted course: ${upserted.name}`);
    }
    console.log('Finished seeding courses.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_courses.js.map