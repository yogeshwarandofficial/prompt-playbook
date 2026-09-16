"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const automated_review_service_1 = require("../automated-review/automated-review.service");
let SubmissionsService = class SubmissionsService {
    prisma;
    automatedReview;
    constructor(prisma, automatedReview) {
        this.prisma = prisma;
        this.automatedReview = automatedReview;
    }
    async submitPhase(userId, studentProjectPhaseId, dto) {
        const spp = await this.prisma.studentProjectPhase.findUnique({
            where: { id: studentProjectPhaseId },
            include: { studentProject: true },
        });
        if (!spp || spp.studentProject.studentId !== userId) {
            throw new common_1.NotFoundException('Phase not found');
        }
        const submittableStatuses = ['AVAILABLE', 'IN_PROGRESS', 'CHANGES_REQUESTED'];
        if (!submittableStatuses.includes(spp.status)) {
            throw new common_1.ForbiddenException(`Cannot submit: phase is currently ${spp.status}. Only AVAILABLE, IN_PROGRESS, or CHANGES_REQUESTED phases can be submitted.`);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const submission = await tx.submission.create({
                data: {
                    studentProjectPhaseId,
                    content: dto.content,
                    repoUrl: dto.repoUrl ?? null,
                    liveUrl: dto.liveUrl ?? null,
                    status: 'SUBMITTED',
                },
            });
            await tx.studentProjectPhase.update({
                where: { id: studentProjectPhaseId },
                data: { status: 'SUBMITTED' },
            });
            if (spp.studentProject.status === 'ASSIGNED') {
                await tx.studentProject.update({
                    where: { id: spp.studentProject.id },
                    data: { status: 'IN_PROGRESS' },
                });
            }
            return submission;
        });
        this.automatedReview.triggerForSubmission(result.id).catch(() => { });
        return result;
    }
    async getPhaseSubmissions(userId, studentProjectPhaseId) {
        const spp = await this.prisma.studentProjectPhase.findUnique({
            where: { id: studentProjectPhaseId },
            include: { studentProject: true },
        });
        if (!spp || spp.studentProject.studentId !== userId) {
            throw new common_1.NotFoundException('Phase not found');
        }
        return this.prisma.submission.findMany({
            where: { studentProjectPhaseId },
            include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async getMyProjects(userId) {
        return this.prisma.studentProject.findMany({
            where: { studentId: userId },
            include: {
                project: {
                    include: {
                        phases: { orderBy: { phaseOrder: 'asc' } },
                        course: { select: { id: true, name: true } },
                    },
                },
                phases: {
                    include: {
                        phase: {
                            include: { topics: { orderBy: { order: 'asc' } } },
                        },
                        submissions: {
                            include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
                            orderBy: { submittedAt: 'desc' },
                            take: 5,
                        },
                    },
                    orderBy: { phase: { phaseOrder: 'asc' } },
                },
            },
            orderBy: { assignedAt: 'desc' },
        });
    }
    async getAdminSubmissions(status) {
        return this.prisma.submission.findMany({
            where: status ? { status: status } : { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
            include: {
                studentProjectPhase: {
                    include: {
                        phase: true,
                        studentProject: {
                            include: {
                                student: { select: { id: true, name: true, studentId: true } },
                                project: { select: { id: true, title: true } },
                            },
                        },
                    },
                },
                reviews: { include: { reviewer: { select: { name: true, role: true } } } },
                automatedReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async getSubmission(id) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: {
                studentProjectPhase: {
                    include: {
                        phase: true,
                        studentProject: {
                            include: {
                                student: { select: { id: true, name: true, studentId: true, email: true } },
                                project: { select: { id: true, title: true } },
                            },
                        },
                    },
                },
                reviews: { include: { reviewer: { select: { id: true, name: true, role: true } } }, orderBy: { reviewedAt: 'desc' } },
                automatedReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        return submission;
    }
    async reviewSubmission(reviewerId, submissionId, dto) {
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                studentProjectPhase: {
                    include: {
                        phase: true,
                        studentProject: {
                            include: { project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } } },
                        },
                    },
                },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        if (!['SUBMITTED', 'UNDER_REVIEW'].includes(submission.status)) {
            throw new common_1.BadRequestException(`Cannot review a submission with status ${submission.status}`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.review.create({
                data: {
                    submissionId,
                    reviewerId,
                    decision: dto.decision,
                    feedback: dto.feedback,
                },
            });
            const spp = submission.studentProjectPhase;
            const sp = spp.studentProject;
            if (dto.decision === 'APPROVED') {
                await tx.submission.update({ where: { id: submissionId }, data: { status: 'APPROVED' } });
                await tx.studentProjectPhase.update({
                    where: { id: spp.id },
                    data: { status: 'COMPLETED' },
                });
                const currentPhaseOrder = spp.phase?.phaseOrder;
                let nextPhase = null;
                if (currentPhaseOrder !== undefined) {
                    const currentPhaseData = await tx.projectPhase.findUnique({ where: { id: spp.phaseId } });
                    if (currentPhaseData) {
                        nextPhase = await tx.projectPhase.findFirst({
                            where: { projectId: sp.projectId, phaseOrder: currentPhaseData.phaseOrder + 1 },
                        });
                    }
                }
                if (nextPhase) {
                    await tx.studentProjectPhase.updateMany({
                        where: { studentProjectId: sp.id, phaseId: nextPhase.id },
                        data: { status: 'AVAILABLE' },
                    });
                }
                else {
                    await tx.studentProject.update({
                        where: { id: sp.id },
                        data: { status: 'COMPLETED', completedAt: new Date() },
                    });
                }
            }
            else if (dto.decision === 'CHANGES_REQUESTED') {
                await tx.submission.update({ where: { id: submissionId }, data: { status: 'CHANGES_REQUESTED' } });
                await tx.studentProjectPhase.update({
                    where: { id: spp.id },
                    data: { status: 'CHANGES_REQUESTED' },
                });
            }
            else if (dto.decision === 'REJECTED') {
                await tx.submission.update({ where: { id: submissionId }, data: { status: 'REJECTED' } });
                await tx.studentProjectPhase.update({
                    where: { id: spp.id },
                    data: { status: 'AVAILABLE' },
                });
            }
            return tx.submission.findUnique({
                where: { id: submissionId },
                include: {
                    reviews: { orderBy: { reviewedAt: 'desc' } },
                    studentProjectPhase: { select: { id: true, status: true } },
                },
            });
        });
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        automated_review_service_1.AutomatedReviewService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map