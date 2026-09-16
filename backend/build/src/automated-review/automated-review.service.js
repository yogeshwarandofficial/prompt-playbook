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
var AutomatedReviewService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomatedReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AutomatedReviewService = AutomatedReviewService_1 = class AutomatedReviewService {
    prisma;
    logger = new common_1.Logger(AutomatedReviewService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async triggerForSubmission(submissionId) {
        try {
            const autoReview = await this.prisma.automatedReview.create({
                data: {
                    submissionId,
                    status: 'PENDING',
                },
            });
            this.runMockAnalysis(autoReview.id, submissionId).catch((err) => this.logger.error(`Automated review failed for submission ${submissionId}: ${err.message}`));
        }
        catch (err) {
            this.logger.error(`Failed to create AutomatedReview record: ${err.message}`);
        }
    }
    async runMockAnalysis(autoReviewId, submissionId) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                studentProjectPhase: {
                    include: { phase: { select: { title: true } } },
                },
            },
        });
        if (!submission) {
            await this.prisma.automatedReview.update({
                where: { id: autoReviewId },
                data: { status: 'FAILED' },
            });
            return;
        }
        const content = submission.content || '';
        const issues = [];
        const suggestions = [];
        let score = 70;
        if (content.length < 50) {
            issues.push('Submission description is very short — consider adding more detail.');
            score -= 15;
        }
        if (!submission.repoUrl) {
            issues.push('No repository URL provided.');
            suggestions.push('Add a public GitHub repository link.');
            score -= 10;
        }
        else if (!submission.repoUrl.includes('github.com') && !submission.repoUrl.includes('gitlab.com')) {
            suggestions.push('Ensure the repository is publicly accessible on GitHub or GitLab.');
        }
        if (!submission.liveUrl) {
            suggestions.push('Consider deploying and sharing a live demo URL.');
        }
        if (content.includes('TODO') || content.includes('WIP')) {
            issues.push('Submission mentions TODO/WIP — ensure work is complete before submitting.');
            score -= 10;
        }
        const phase = submission.studentProjectPhase?.phase?.title ?? 'this phase';
        const summary = issues.length === 0
            ? `Automated check for "${phase}" passed basic validation. ${score}/100 advisory score. Human review required for final decision.`
            : `Automated check for "${phase}" flagged ${issues.length} item(s) for human reviewer attention. ${score}/100 advisory score. This is advisory only — human review is authoritative.`;
        await this.prisma.automatedReview.update({
            where: { id: autoReviewId },
            data: {
                status: 'COMPLETED',
                summary,
                detectedIssues: issues,
                suggestions,
                score: Math.max(0, score),
            },
        });
    }
    async getForSubmission(submissionId) {
        return this.prisma.automatedReview.findFirst({
            where: { submissionId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AutomatedReviewService = AutomatedReviewService;
exports.AutomatedReviewService = AutomatedReviewService = AutomatedReviewService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AutomatedReviewService);
//# sourceMappingURL=automated-review.service.js.map