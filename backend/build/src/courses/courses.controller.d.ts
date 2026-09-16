import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
