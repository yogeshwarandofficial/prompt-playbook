import { AdminService } from './admin.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createStudent(createStudentDto: CreateStudentDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        batchId: string | null;
        college: string | null;
        degree: string | null;
        domainId: string | null;
        graduationYear: number | null;
        phone: string | null;
        specializationId: string | null;
    }>;
    getStudents(): Promise<{
        courses: ({
            course: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            studentId: string;
            courseId: string;
        })[];
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        batchId: string | null;
        college: string | null;
        degree: string | null;
        domainId: string | null;
        graduationYear: number | null;
        phone: string | null;
        specializationId: string | null;
    }[]>;
    createCourse(createCourseDto: CreateCourseDto): Promise<{
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
    }>;
    getCourses(): Promise<{
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
    removeCourse(id: string): Promise<{
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
    }>;
    restoreCourse(id: string): Promise<{
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
    }>;
    getDashboardStats(): Promise<{
        totalStudents: number;
        activeStudents: number;
        activeCourses: number;
        activeProjects: number;
        inProgressAssignments: number;
        pendingSubmissions: number;
        completedInternships: number;
        pendingApplications: number;
        activeBatches: number;
        scheduledInterviews: number;
        issuedCertificates: number;
    }>;
    assignCourse(studentId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        courseId: string;
    }>;
}
