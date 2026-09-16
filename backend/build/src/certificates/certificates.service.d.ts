import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateDynamicCertificate(studentProjectId: string, studentId: string): Promise<Buffer>;
    checkEligibility(studentProjectId: string): Promise<{
        eligible: boolean;
        reason?: string;
        studentProject?: any;
    }>;
    findEligible(): Promise<({
        project: {
            id: string;
            title: string;
        };
        student: {
            id: string;
            name: string;
            studentId: string;
            email: string;
        };
        phases: {
            status: import(".prisma/client").$Enums.PhaseStatus;
        }[];
    } & {
        id: string;
        studentId: string;
        status: import(".prisma/client").$Enums.StudentProjectStatus;
        projectId: string;
        assignedAt: Date;
        dueDate: Date | null;
        completedAt: Date | null;
    })[]>;
    findAll(): Promise<({
        studentProject: {
            project: {
                id: string;
                title: string;
            };
            student: {
                id: string;
                name: string;
                studentId: string;
                email: string;
            };
        } & {
            id: string;
            studentId: string;
            status: import(".prisma/client").$Enums.StudentProjectStatus;
            projectId: string;
            assignedAt: Date;
            dueDate: Date | null;
            completedAt: Date | null;
        };
    } & {
        id: string;
        studentId: string;
        domain: string;
        specialization: string | null;
        status: import(".prisma/client").$Enums.CertificateStatus;
        studentProjectId: string;
        startDate: Date;
        certificateNo: string;
        verificationToken: string;
        endDate: Date;
        issuedAt: Date;
        revokedAt: Date | null;
        revokeReason: string | null;
    })[]>;
    findOne(id: string): Promise<{
        studentProject: {
            project: {
                id: string;
                title: string;
            };
            student: {
                id: string;
                name: string;
                studentId: string;
                email: string;
            };
        } & {
            id: string;
            studentId: string;
            status: import(".prisma/client").$Enums.StudentProjectStatus;
            projectId: string;
            assignedAt: Date;
            dueDate: Date | null;
            completedAt: Date | null;
        };
    } & {
        id: string;
        studentId: string;
        domain: string;
        specialization: string | null;
        status: import(".prisma/client").$Enums.CertificateStatus;
        studentProjectId: string;
        startDate: Date;
        certificateNo: string;
        verificationToken: string;
        endDate: Date;
        issuedAt: Date;
        revokedAt: Date | null;
        revokeReason: string | null;
    }>;
    issue(dto: IssueCertificateDto): Promise<{
        id: string;
        studentId: string;
        domain: string;
        specialization: string | null;
        status: import(".prisma/client").$Enums.CertificateStatus;
        studentProjectId: string;
        startDate: Date;
        certificateNo: string;
        verificationToken: string;
        endDate: Date;
        issuedAt: Date;
        revokedAt: Date | null;
        revokeReason: string | null;
    }>;
    revoke(id: string, dto: RevokeCertificateDto): Promise<{
        id: string;
        studentId: string;
        domain: string;
        specialization: string | null;
        status: import(".prisma/client").$Enums.CertificateStatus;
        studentProjectId: string;
        startDate: Date;
        certificateNo: string;
        verificationToken: string;
        endDate: Date;
        issuedAt: Date;
        revokedAt: Date | null;
        revokeReason: string | null;
    }>;
    getStudentCertificate(studentId: string): Promise<({
        studentProject: {
            project: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                courseId: string | null;
                status: import(".prisma/client").$Enums.ProjectStatus;
                title: string;
                projectLink: string | null;
            };
            certificate: {
                id: string;
                studentId: string;
                domain: string;
                specialization: string | null;
                status: import(".prisma/client").$Enums.CertificateStatus;
                studentProjectId: string;
                startDate: Date;
                certificateNo: string;
                verificationToken: string;
                endDate: Date;
                issuedAt: Date;
                revokedAt: Date | null;
                revokeReason: string | null;
            } | null;
            student: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                batchId: string | null;
                college: string | null;
                degree: string | null;
                domainId: string | null;
                graduationYear: number | null;
                phone: string | null;
                specializationId: string | null;
            };
        } & {
            id: string;
            studentId: string;
            status: import(".prisma/client").$Enums.StudentProjectStatus;
            projectId: string;
            assignedAt: Date;
            dueDate: Date | null;
            completedAt: Date | null;
        };
        id: string;
        studentId: string;
        domain: string;
        specialization: string | null;
        status: import(".prisma/client").$Enums.CertificateStatus;
        studentProjectId: string;
        startDate: Date;
        certificateNo: string;
        verificationToken: string;
        endDate: Date;
        issuedAt: Date;
        revokedAt: Date | null;
        revokeReason: string | null;
    } | {
        id: string;
        studentId: string;
        studentProjectId: string;
        certificateNo: string;
        verificationToken: string;
        status: string;
        issuedAt: Date;
        studentProject: {
            project: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                courseId: string | null;
                status: import(".prisma/client").$Enums.ProjectStatus;
                title: string;
                projectLink: string | null;
            };
            certificate: {
                id: string;
                studentId: string;
                domain: string;
                specialization: string | null;
                status: import(".prisma/client").$Enums.CertificateStatus;
                studentProjectId: string;
                startDate: Date;
                certificateNo: string;
                verificationToken: string;
                endDate: Date;
                issuedAt: Date;
                revokedAt: Date | null;
                revokeReason: string | null;
            } | null;
            student: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                batchId: string | null;
                college: string | null;
                degree: string | null;
                domainId: string | null;
                graduationYear: number | null;
                phone: string | null;
                specializationId: string | null;
            };
        } & {
            id: string;
            studentId: string;
            status: import(".prisma/client").$Enums.StudentProjectStatus;
            projectId: string;
            assignedAt: Date;
            dueDate: Date | null;
            completedAt: Date | null;
        };
    })[]>;
}
