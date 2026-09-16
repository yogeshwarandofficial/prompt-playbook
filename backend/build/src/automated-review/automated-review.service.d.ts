import { PrismaService } from '../prisma/prisma.service';
export declare class AutomatedReviewService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    triggerForSubmission(submissionId: string): Promise<void>;
    private runMockAnalysis;
    getForSubmission(submissionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string | null;
        status: import(".prisma/client").$Enums.AutomatedReviewStatus;
        detectedIssues: import("@prisma/client/runtime/library").JsonValue | null;
        suggestions: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
        submissionId: string;
    } | null>;
}
