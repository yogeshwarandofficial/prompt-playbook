import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
export declare class SpecializationsController {
    private readonly specializationsService;
    constructor(specializationsService: SpecializationsService);
    create(createSpecializationDto: CreateSpecializationDto): import(".prisma/client").Prisma.Prisma__SpecializationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
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
        _count: {
            batches: number;
            curricula: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
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
    } & {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
    }>;
    update(id: string, updateSpecializationDto: UpdateSpecializationDto): import(".prisma/client").Prisma.Prisma__SpecializationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__SpecializationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        domainId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
