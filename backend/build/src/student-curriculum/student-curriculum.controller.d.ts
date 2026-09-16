import { StudentCurriculumService } from './student-curriculum.service';
export declare class StudentCurriculumController {
    private readonly studentCurriculumService;
    constructor(studentCurriculumService: StudentCurriculumService);
    getEnrollment(req: any): Promise<({
        batch: ({
            domain: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            specialization: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                domainId: string;
            } | null;
        } & {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            domainId: string;
            specializationId: string | null;
            status: import(".prisma/client").$Enums.BatchStatus;
            curriculumVersionId: string | null;
            startDate: Date;
            durationWeeks: number;
        }) | null;
        curriculumVersion: {
            curriculum: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                domainId: string;
                specializationId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CurriculumStatus;
            curriculumId: string;
            version: string;
            publishedAt: Date | null;
        };
        phaseProgress: ({
            phase: {
                resources: {
                    id: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    title: string;
                    order: number;
                    type: import(".prisma/client").$Enums.ResourceType;
                    url: string;
                    curriculumPhaseId: string;
                }[];
                tasks: {
                    id: string;
                    description: string;
                    isActive: boolean;
                    createdAt: Date;
                    title: string;
                    order: number;
                    instructions: string | null;
                    curriculumPhaseId: string;
                    isRequired: boolean;
                }[];
            } & {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                projectId: string | null;
                curriculumVersionId: string;
                phaseNumber: number;
                objectives: string | null;
                durationDays: number;
                phaseType: import(".prisma/client").$Enums.CurriculumPhaseType;
                googleSheetUrl: string | null;
                sheetVisibleFrom: Date | null;
                requiresGitHub: boolean;
                requiresLiveDemo: boolean;
                isPublished: boolean;
            };
            studentTasks: {
                id: string;
                completedAt: Date | null;
                progressId: string;
                taskId: string;
                isCompleted: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PhaseStatus;
            phaseId: string;
            completedAt: Date | null;
            enrollmentId: string;
            startedAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        batchId: string | null;
        status: import(".prisma/client").$Enums.InternshipStatus;
        completedAt: Date | null;
        curriculumVersionId: string;
        startDate: Date;
    }) | null>;
    getPhaseProgress(req: any, phaseId: string): Promise<{
        phase: {
            resources: {
                id: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                title: string;
                order: number;
                type: import(".prisma/client").$Enums.ResourceType;
                url: string;
                curriculumPhaseId: string;
            }[];
            tasks: {
                id: string;
                description: string;
                isActive: boolean;
                createdAt: Date;
                title: string;
                order: number;
                instructions: string | null;
                curriculumPhaseId: string;
                isRequired: boolean;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            projectId: string | null;
            curriculumVersionId: string;
            phaseNumber: number;
            objectives: string | null;
            durationDays: number;
            phaseType: import(".prisma/client").$Enums.CurriculumPhaseType;
            googleSheetUrl: string | null;
            sheetVisibleFrom: Date | null;
            requiresGitHub: boolean;
            requiresLiveDemo: boolean;
            isPublished: boolean;
        };
        studentTasks: {
            id: string;
            completedAt: Date | null;
            progressId: string;
            taskId: string;
            isCompleted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PhaseStatus;
        phaseId: string;
        completedAt: Date | null;
        enrollmentId: string;
        startedAt: Date | null;
    }>;
    completeTask(req: any, progressId: string, taskId: string): Promise<{
        id: string;
        completedAt: Date | null;
        progressId: string;
        taskId: string;
        isCompleted: boolean;
    }>;
    uncompleteTask(req: any, progressId: string, taskId: string): Promise<{
        id: string;
        completedAt: Date | null;
        progressId: string;
        taskId: string;
        isCompleted: boolean;
    }>;
}
