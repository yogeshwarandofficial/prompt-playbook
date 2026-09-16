import { StudentService } from './student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getMyCourses(req: any): Promise<{
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
