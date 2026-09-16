import { CertificatesService } from './certificates.service';
export declare class StudentCertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    getMyCertificate(req: any): Promise<({
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
    downloadCertificate(req: any, studentProjectId: string, res: any): Promise<void>;
}
