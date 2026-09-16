import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { ReorderPhasesDto } from './dto/reorder-phases.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ReorderTopicsDto } from './dto/reorder-topics.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProject(dto: CreateProjectDto): Promise<{
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
    }>;
    getProjects(status?: string): Promise<({
        course: {
            id: string;
            name: string;
        } | null;
        _count: {
            phases: number;
            assignments: number;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
        title: string;
        projectLink: string | null;
    })[]>;
    getProject(id: string): Promise<{
        course: {
            id: string;
            name: string;
        } | null;
        _count: {
            assignments: number;
        };
        phases: ({
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
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
        title: string;
        projectLink: string | null;
    }>;
    updateProject(id: string, dto: UpdateProjectDto): Promise<{
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
    }>;
    addPhase(projectId: string, dto: CreatePhaseDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        phaseOrder: number;
        projectId: string;
        instructions: string;
    }>;
    updatePhase(projectId: string, phaseId: string, dto: Partial<CreatePhaseDto>): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        phaseOrder: number;
        projectId: string;
        instructions: string;
    }>;
    reorderPhases(projectId: string, dto: ReorderPhasesDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        phaseOrder: number;
        projectId: string;
        instructions: string;
    }[]>;
    deletePhase(projectId: string, phaseId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        phaseOrder: number;
        projectId: string;
        instructions: string;
    }>;
    addTopic(projectId: string, phaseId: string, dto: CreateTopicDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        projectPhaseId: string;
        blogUrl: string;
    }>;
    updateTopic(projectId: string, phaseId: string, topicId: string, dto: UpdateTopicDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        projectPhaseId: string;
        blogUrl: string;
    }>;
    reorderTopics(projectId: string, phaseId: string, dto: ReorderTopicsDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        projectPhaseId: string;
        blogUrl: string;
    }[]>;
    deleteTopic(projectId: string, phaseId: string, topicId: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        projectPhaseId: string;
        blogUrl: string;
    }>;
}
