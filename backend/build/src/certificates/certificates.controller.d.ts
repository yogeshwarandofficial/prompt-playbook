import { CertificatesService } from './certificates.service';
import { IssueCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
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
}
