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
var InterviewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let InterviewsService = InterviewsService_1 = class InterviewsService {
    prisma;
    email;
    logger = new common_1.Logger(InterviewsService_1.name);
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    async scheduleInterview(dto) {
        const application = await this.prisma.application.findUnique({
            where: { id: dto.applicationId },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.status === 'PENDING' || application.status === 'ACCEPTED' || application.status === 'REJECTED') {
            throw new common_1.BadRequestException(`Cannot schedule interview for application with status: ${application.status}. Must be SHORTLISTED or UNDER_REVIEW.`);
        }
        const existing = await this.prisma.interview.findFirst({
            where: {
                applicationId: dto.applicationId,
                status: 'SCHEDULED',
            },
        });
        if (existing) {
            throw new common_1.ConflictException('An active interview is already scheduled for this application');
        }
        if (application.status === 'UNDER_REVIEW') {
            await this.prisma.application.update({
                where: { id: dto.applicationId },
                data: { status: 'SHORTLISTED' },
            });
        }
        const interview = await this.prisma.interview.create({
            data: {
                applicationId: dto.applicationId,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
                meetingLink: dto.meetingLink,
                interviewerId: dto.interviewerId,
                status: 'SCHEDULED',
                result: 'PENDING',
            },
            include: {
                application: { select: { name: true, email: true, status: true } },
            },
        });
        if (interview.application?.email && interview.scheduledAt) {
            this.email
                .sendInterviewInvitation({
                applicantName: interview.application.name,
                applicantEmail: interview.application.email,
                scheduledAt: interview.scheduledAt,
                meetingLink: interview.meetingLink,
                interviewId: interview.id,
            })
                .catch((err) => this.logger.error('Failed to send interview invitation email', err));
        }
        return interview;
    }
    async findAll(status) {
        return this.prisma.interview.findMany({
            where: status ? { status: status } : undefined,
            orderBy: { scheduledAt: 'asc' },
            include: {
                application: {
                    select: { id: true, name: true, email: true, phone: true, status: true, domainId: true },
                },
            },
        });
    }
    async findOne(id) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: {
                application: true,
            },
        });
        if (!interview)
            throw new common_1.NotFoundException(`Interview #${id} not found`);
        return interview;
    }
    async updateInterview(id, dto) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview)
            throw new common_1.NotFoundException('Interview not found');
        if (interview.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Can only update SCHEDULED interviews');
        }
        return this.prisma.interview.update({
            where: { id },
            data: {
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
                meetingLink: dto.meetingLink,
                interviewerId: dto.interviewerId,
            },
        });
    }
    async cancelInterview(id) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview)
            throw new common_1.NotFoundException('Interview not found');
        if (interview.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Can only cancel SCHEDULED interviews');
        }
        return this.prisma.interview.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async recordResult(id, dto) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: { application: true },
        });
        if (!interview)
            throw new common_1.NotFoundException('Interview not found');
        if (interview.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Can only record result for SCHEDULED interviews');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.interview.update({
                where: { id },
                data: {
                    status: 'COMPLETED',
                    result: dto.result,
                    feedback: dto.feedback,
                    technicalScore: dto.technicalScore,
                    projectScore: dto.projectScore,
                    communicationScore: dto.communicationScore,
                    overallScore: dto.overallScore,
                },
                include: {
                    application: { select: { id: true, name: true, email: true } },
                },
            });
            let newAppStatus = interview.application.status;
            if (dto.result === 'SELECTED')
                newAppStatus = 'ACCEPTED';
            else if (dto.result === 'REJECTED')
                newAppStatus = 'REJECTED';
            await tx.application.update({
                where: { id: interview.applicationId },
                data: { status: newAppStatus },
            });
            return updated;
        });
    }
    async markNoShow(id) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview)
            throw new common_1.NotFoundException('Interview not found');
        if (interview.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Can only mark SCHEDULED interviews as NO_SHOW');
        }
        return this.prisma.interview.update({
            where: { id },
            data: { status: 'NO_SHOW' },
        });
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = InterviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map