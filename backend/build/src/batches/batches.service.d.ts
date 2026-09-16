import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
export declare class BatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBatchDto: CreateBatchDto): import(".prisma/client").Prisma.Prisma__BatchClient<{
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
        _count: {
            enrollments: number;
        };
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
        curriculumVersion: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CurriculumStatus;
            curriculumId: string;
            version: string;
            publishedAt: Date | null;
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
    }>;
    update(id: string, updateBatchDto: UpdateBatchDto): import(".prisma/client").Prisma.Prisma__BatchClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__BatchClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
