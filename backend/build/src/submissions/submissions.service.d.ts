import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AutomatedReviewService } from '../automated-review/automated-review.service';
export declare class SubmissionsService {
    private prisma;
    private automatedReview;
    constructor(prisma: PrismaService, automatedReview: AutomatedReviewService);
    submitPhase(userId: string, studentProjectPhaseId: string, dto: CreateSubmissionDto): Promise<{
        id: string;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        submittedAt: Date;
        studentProjectPhaseId: string;
        repoUrl: string | null;
        liveUrl: string | null;
    }>;
    getPhaseSubmissions(userId: string, studentProjectPhaseId: string): Promise<({
        reviews: ({
            reviewer: {
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            decision: import(".prisma/client").$Enums.ReviewDecision;
            feedback: string;
            score: number | null;
            submissionId: string;
            reviewedAt: Date;
            reviewerId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        submittedAt: Date;
        studentProjectPhaseId: string;
        repoUrl: string | null;
        liveUrl: string | null;
    })[]>;
    getMyProjects(userId: string): Promise<({
        project: {
            course: {
                id: string;
                name: string;
            } | null;
            phases: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                phaseOrder: number;
                projectId: string;
                instructions: string;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
            status: import(".prisma/client").$Enums.ProjectStatus;
            title: string;
            projectLink: string | null;
        };
        phases: ({
            phase: {
                topics: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    order: number;
                    projectPhaseId: string;
                    blogUrl: string;
                }[];
            } & {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                phaseOrder: number;
                projectId: string;
                instructions: string;
            };
            submissions: ({
                reviews: ({
                    reviewer: {
                        name: string;
                        role: import(".prisma/client").$Enums.Role;
                    };
                } & {
                    id: string;
                    decision: import(".prisma/client").$Enums.ReviewDecision;
                    feedback: string;
                    score: number | null;
                    submissionId: string;
                    reviewedAt: Date;
                    reviewerId: string;
                })[];
            } & {
                id: string;
                updatedAt: Date;
                content: string;
                status: import(".prisma/client").$Enums.SubmissionStatus;
                submittedAt: Date;
                studentProjectPhaseId: string;
                repoUrl: string | null;
                liveUrl: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PhaseStatus;
            phaseId: string;
            studentProjectId: string;
        })[];
    } & {
        id: string;
        studentId: string;
        status: import(".prisma/client").$Enums.StudentProjectStatus;
        projectId: string;
        assignedAt: Date;
        dueDate: Date | null;
        completedAt: Date | null;
    })[]>;
    getAdminSubmissions(status?: string): Promise<({
        studentProjectPhase: {
            studentProject: {
                project: {
                    id: string;
                    title: string;
                };
                student: {
                    id: string;
                    name: string;
                    studentId: string;
                };
            } & {
                id: string;
                studentId: string;
                status: import(".prisma/client").$Enums.StudentProjectStatus;
                projectId: string;
                assignedAt: Date;
                dueDate: Date | null;
                completedAt: Date | null;
            };
            phase: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                phaseOrder: number;
                projectId: string;
                instructions: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PhaseStatus;
            phaseId: string;
            studentProjectId: string;
        };
        automatedReviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            summary: string | null;
            status: import(".prisma/client").$Enums.AutomatedReviewStatus;
            detectedIssues: import("@prisma/client/runtime/library").JsonValue | null;
            suggestions: import("@prisma/client/runtime/library").JsonValue | null;
            score: number | null;
            submissionId: string;
        }[];
        reviews: ({
            reviewer: {
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            decision: import(".prisma/client").$Enums.ReviewDecision;
            feedback: string;
            score: number | null;
            submissionId: string;
            reviewedAt: Date;
            reviewerId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        submittedAt: Date;
        studentProjectPhaseId: string;
        repoUrl: string | null;
        liveUrl: string | null;
    })[]>;
    getSubmission(id: string): Promise<{
        studentProjectPhase: {
            studentProject: {
                project: {
                    id: string;
                    title: string;
                };
                student: {
                    id: string;
                    name: string;
                    studentId: string;
                    email: string;
                };
            } & {
                id: string;
                studentId: string;
                status: import(".prisma/client").$Enums.StudentProjectStatus;
                projectId: string;
                assignedAt: Date;
                dueDate: Date | null;
                completedAt: Date | null;
            };
            phase: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                phaseOrder: number;
                projectId: string;
                instructions: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PhaseStatus;
            phaseId: string;
            studentProjectId: string;
        };
        automatedReviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            summary: string | null;
            status: import(".prisma/client").$Enums.AutomatedReviewStatus;
            detectedIssues: import("@prisma/client/runtime/library").JsonValue | null;
            suggestions: import("@prisma/client/runtime/library").JsonValue | null;
            score: number | null;
            submissionId: string;
        }[];
        reviews: ({
            reviewer: {
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            decision: import(".prisma/client").$Enums.ReviewDecision;
            feedback: string;
            score: number | null;
            submissionId: string;
            reviewedAt: Date;
            reviewerId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        submittedAt: Date;
        studentProjectPhaseId: string;
        repoUrl: string | null;
        liveUrl: string | null;
    }>;
    reviewSubmission(reviewerId: string, submissionId: string, dto: CreateReviewDto): Promise<({
        studentProjectPhase: {
            id: string;
            status: import(".prisma/client").$Enums.PhaseStatus;
        };
        reviews: {
            id: string;
            decision: import(".prisma/client").$Enums.ReviewDecision;
            feedback: string;
            score: number | null;
            submissionId: string;
            reviewedAt: Date;
            reviewerId: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        submittedAt: Date;
        studentProjectPhaseId: string;
        repoUrl: string | null;
        liveUrl: string | null;
    }) | null>;
}
