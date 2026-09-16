import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEventDto: CreateEventDto): import(".prisma/client").Prisma.Prisma__EventClient<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        title: string;
        imageUrl: string | null;
        date: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        title: string;
        imageUrl: string | null;
        date: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        title: string;
        imageUrl: string | null;
        date: Date;
    }>;
    update(id: string, updateEventDto: UpdateEventDto): import(".prisma/client").Prisma.Prisma__EventClient<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        title: string;
        imageUrl: string | null;
        date: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__EventClient<{
        id: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        title: string;
        imageUrl: string | null;
        date: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
