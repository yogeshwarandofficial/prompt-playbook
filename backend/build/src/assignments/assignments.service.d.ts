import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    assignProject(dto: CreateAssignmentDto): Promise<({
        project: {
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
        student: {
            id: string;
            name: string;
            studentId: string;
            email: string;
        };
        phases: ({
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
        })[];
    } & {
        id: string;
        studentId: string;
        status: import(".prisma/client").$Enums.StudentProjectStatus;
        projectId: string;
        assignedAt: Date;
        dueDate: Date | null;
        completedAt: Date | null;
    }) | null>;
    getAssignments(): Promise<({
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
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
    })[]>;
    getStudentInternship(studentId: string): Promise<{
        student: {
            id: string;
            name: string;
            studentId: string;
            email: string;
        };
        assignments: ({
            project: {
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
        })[];
    }>;
}
