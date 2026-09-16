import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { CreateCurriculumVersionDto } from './dto/create-version.dto';
import { CreateCurriculumPhaseDto } from './dto/create-phase.dto';
import { CreateCurriculumResourceDto } from './dto/create-resource.dto';
import { CreateCurriculumTaskDto } from './dto/create-task.dto';
export declare class CurriculumController {
    private readonly curriculumService;
    constructor(curriculumService: CurriculumService);
    create(createCurriculumDto: CreateCurriculumDto): import(".prisma/client").Prisma.Prisma__CurriculumClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
        specializationId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        versions: {
            id: string;
            status: import(".prisma/client").$Enums.CurriculumStatus;
            version: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
        specializationId: string | null;
    })[]>;
    findOne(id: string): Promise<{
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
        versions: ({
            phases: {
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
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CurriculumStatus;
            curriculumId: string;
            version: string;
            publishedAt: Date | null;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
        specializationId: string | null;
    }>;
    update(id: string, updateCurriculumDto: UpdateCurriculumDto): import(".prisma/client").Prisma.Prisma__CurriculumClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
        specializationId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__CurriculumClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
        specializationId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createVersion(dto: CreateCurriculumVersionDto): import(".prisma/client").Prisma.Prisma__CurriculumVersionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CurriculumStatus;
        curriculumId: string;
        version: string;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createPhase(versionId: string, dto: CreateCurriculumPhaseDto): import(".prisma/client").Prisma.Prisma__CurriculumPhaseClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createResource(phaseId: string, dto: CreateCurriculumResourceDto): import(".prisma/client").Prisma.Prisma__PhaseResourceClient<{
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        title: string;
        order: number;
        type: import(".prisma/client").$Enums.ResourceType;
        url: string;
        curriculumPhaseId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createTask(phaseId: string, dto: CreateCurriculumTaskDto): import(".prisma/client").Prisma.Prisma__PhaseTaskClient<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        order: number;
        instructions: string | null;
        curriculumPhaseId: string;
        isRequired: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
