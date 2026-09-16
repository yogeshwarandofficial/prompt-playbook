import { PrismaService } from '../prisma/prisma.service';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllActive(): Promise<{
        id: string;
        key: string;
        name: string;
        description: string;
        duration: string;
        skills: string[];
        image: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
