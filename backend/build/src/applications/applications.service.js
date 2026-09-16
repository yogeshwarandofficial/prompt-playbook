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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const resend_1 = require("resend");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto) {
        const application = await this.prisma.application.create({
            data: {
                ...createApplicationDto,
                status: 'PENDING',
            },
        });
        this.sendApplicationEmails(application).catch(e => console.error("Email error:", e));
        return application;
    }
    async sendApplicationEmails(app) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('RESEND_API_KEY not found. Skipping emails.');
            return;
        }
        const resend = new resend_1.Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        let resumeData = undefined;
        let resumeType = 'application/pdf';
        let resumeName = 'resume.pdf';
        if (app.resumeUrl && app.resumeUrl.startsWith('data:')) {
            const parts = app.resumeUrl.split(',');
            if (parts.length === 2) {
                resumeData = parts[1];
                const mimeMatch = parts[0].match(/data:(.*?);/);
                if (mimeMatch) {
                    resumeType = mimeMatch[1];
                    const ext = resumeType.split('/')[1] || 'pdf';
                    resumeName = `resume.${ext}`;
                }
            }
        }
        await resend.emails.send({
            from: `Infynux Academy <${fromEmail}>`,
            to: app.email,
            subject: "Internship Application Received — Infynux Academy 🚀",
            html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
          <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">Hello ${app.name},</h2>
          <p style="font-size:16px;line-height:1.5;color:#374151">Thank you for applying for the <strong>${app.domainId || 'General'}</strong> internship at Infynux Academy.</p>
          <p style="font-size:16px;line-height:1.5;color:#374151">Our team will review your profile and get back to you within <strong>2–3 business days</strong>.</p>
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;font-size:14px">
            <p style="margin:0;font-weight:bold;color:#374151">Application Summary:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#4b5563">
              <li><strong>Domain:</strong> ${app.domainId || 'General'}</li>
              <li><strong>Sub-domain:</strong> ${app.specializationId || "Not specified"}</li>
              <li><strong>College:</strong> ${app.college || "Not specified"}</li>
              <li><strong>Mobile:</strong> ${app.phone || "Not specified"}</li>
            </ul>
          </div>
          <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
          <p style="font-size:14px;font-weight:600;color:#374151">— The Infynux Academy Team</p>
        </div>
      `,
        });
        const adminTo = process.env.RESEND_TO_EMAIL_OVERRIDE || "support@infynuxsolutions.in";
        const attachments = [];
        if (resumeData) {
            attachments.push({
                filename: resumeName,
                content: resumeData,
                contentType: resumeType,
            });
        }
        await resend.emails.send({
            from: `Infynux System <${fromEmail}>`,
            to: adminTo,
            subject: `New Internship Application: ${app.name} (${app.domainId || 'General'})`,
            attachments,
            html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
          <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">New Internship Application</h2>
          <table style="font-size:14px;line-height:1.8;color:#374151;width:100%">
            <tr><td><strong>Name:</strong></td><td>${app.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${app.email}</td></tr>
            <tr><td><strong>Mobile:</strong></td><td>${app.phone || 'N/A'}</td></tr>
            <tr><td><strong>College:</strong></td><td>${app.college || 'N/A'}</td></tr>
            <tr><td><strong>Domain:</strong></td><td>${app.domainId || 'None'} — ${app.specializationId || 'None'}</td></tr>
            <tr><td><strong>Resume:</strong></td><td>${resumeData ? `📎 ${resumeName} (attached)` : 'No resume uploaded'}</td></tr>
          </table>
          ${app.message ? `
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
            <p style="margin:0;font-weight:bold">Message:</p>
            <p style="margin:8px 0 0;white-space:pre-wrap">${app.message}</p>
          </div>` : ""}
        </div>
      `,
        });
    }
    findAll(status) {
        return this.prisma.application.findMany({
            where: status ? { status: status } : undefined,
            orderBy: { appliedAt: 'desc' },
        });
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application #${id} not found`);
        }
        return application;
    }
    async reviewApplication(id, reviewerId, dto) {
        const application = await this.prisma.application.findUnique({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.status === 'ACCEPTED') {
            throw new common_1.BadRequestException('Application already accepted');
        }
        if (dto.status === 'SHORTLISTED') {
            return this.prisma.application.update({
                where: { id },
                data: {
                    status: 'SHORTLISTED',
                    reviewNotes: dto.reviewNotes,
                    reviewedBy: reviewerId,
                    reviewedAt: new Date(),
                }
            });
        }
        return this.prisma.$transaction(async (tx) => {
            let createdUserId = null;
            if (dto.status === 'ACCEPTED') {
                const existing = await tx.user.findFirst({
                    where: { email: application.email }
                });
                if (existing) {
                    throw new common_1.ConflictException('User with this email already exists');
                }
                const studentId = `INFY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash('password123', salt);
                const newUser = await tx.user.create({
                    data: {
                        studentId,
                        name: application.name,
                        email: application.email,
                        passwordHash,
                        role: 'STUDENT',
                        phone: application.phone,
                        college: application.college,
                        degree: application.degree,
                        graduationYear: application.graduationYear,
                        domainId: application.domainId,
                        specializationId: application.specializationId,
                        batchId: dto.batchId,
                    }
                });
                createdUserId = newUser.id;
                if (dto.batchId && dto.curriculumVersionId) {
                    const batch = await tx.batch.findUnique({ where: { id: dto.batchId } });
                    if (batch) {
                        const enrollment = await tx.studentCurriculumEnrollment.create({
                            data: {
                                studentId: newUser.id,
                                batchId: batch.id,
                                curriculumVersionId: dto.curriculumVersionId,
                                startDate: batch.startDate,
                                status: 'ACTIVE',
                            }
                        });
                        const phases = await tx.curriculumPhase.findMany({
                            where: { curriculumVersionId: dto.curriculumVersionId },
                            orderBy: { phaseNumber: 'asc' }
                        });
                        if (phases.length > 0) {
                            await tx.studentPhaseProgress.createMany({
                                data: phases.map((p, index) => ({
                                    enrollmentId: enrollment.id,
                                    phaseId: p.id,
                                    status: index === 0 ? 'AVAILABLE' : 'LOCKED'
                                }))
                            });
                        }
                    }
                }
            }
            return tx.application.update({
                where: { id },
                data: {
                    status: dto.status,
                    reviewNotes: dto.reviewNotes,
                    reviewedBy: reviewerId,
                    reviewedAt: new Date(),
                    createdUserId,
                }
            });
        });
    }
    async createStudentAccount(applicationId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: { interviews: true }
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        const selectedInterview = application.interviews.find(i => i.result === 'SELECTED' && i.status === 'COMPLETED');
        if (!selectedInterview) {
            throw new common_1.BadRequestException('Application must have a completed, selected interview');
        }
        if (application.createdUserId) {
            throw new common_1.ConflictException('Student account already created for this application');
        }
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.user.findFirst({
                where: { email: application.email }
            });
            if (existing) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            const year = new Date().getFullYear();
            let studentId = '';
            let isUnique = false;
            while (!isUnique) {
                const randomDigits = Math.floor(1000 + Math.random() * 9000);
                studentId = `INFY-${year}-${randomDigits}`;
                const existingId = await tx.user.findUnique({ where: { studentId } });
                if (!existingId)
                    isUnique = true;
            }
            const tempPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(tempPassword, salt);
            const newUser = await tx.user.create({
                data: {
                    studentId,
                    name: application.name,
                    email: application.email,
                    passwordHash,
                    role: 'STUDENT',
                    isActive: true,
                    phone: application.phone,
                    college: application.college,
                    degree: application.degree,
                    graduationYear: application.graduationYear,
                    domainId: application.domainId,
                    specializationId: application.specializationId,
                }
            });
            if (application.domainId) {
                const course = await tx.course.findFirst({
                    where: {
                        OR: [
                            { name: { equals: application.domainId, mode: 'insensitive' } },
                            { name: { contains: application.domainId, mode: 'insensitive' } },
                        ]
                    }
                });
                if (course) {
                    await tx.studentCourse.create({
                        data: {
                            studentId: newUser.id,
                            courseId: course.id
                        }
                    });
                }
            }
            await tx.application.update({
                where: { id: application.id },
                data: { createdUserId: newUser.id }
            });
            return {
                id: newUser.id,
                studentId,
                name: newUser.name,
                email: newUser.email,
                tempPassword,
                domainId: newUser.domainId,
                specializationId: newUser.specializationId
            };
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map