import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { RecordInterviewResultDto } from './dto/record-result.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
export declare class InterviewsService {
    private prisma;
    private email;
    private readonly logger;
    constructor(prisma: PrismaService, email: EmailService);
    scheduleInterview(dto: ScheduleInterviewDto): Promise<{
        application: {
            name: string;
            email: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
    findAll(status?: string): Promise<({
        application: {
            id: string;
            name: string;
            email: string;
            domainId: string | null;
            phone: string | null;
            status: import(".prisma/client").$Enums.ApplicationStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    })[]>;
    findOne(id: string): Promise<{
        application: {
            id: string;
            name: string;
            updatedAt: Date;
            email: string;
            college: string | null;
            degree: string | null;
            domainId: string | null;
            graduationYear: number | null;
            phone: string | null;
            specializationId: string | null;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            resumeUrl: string | null;
            message: string | null;
            reviewedBy: string | null;
            createdUserId: string | null;
            appliedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
    updateInterview(id: string, dto: UpdateInterviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
    cancelInterview(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
    recordResult(id: string, dto: RecordInterviewResultDto): Promise<{
        application: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
    markNoShow(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import(".prisma/client").$Enums.InterviewResult | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        feedback: string | null;
        scheduledAt: Date | null;
        meetingLink: string | null;
        interviewerId: string | null;
        technicalScore: number | null;
        projectScore: number | null;
        communicationScore: number | null;
        overallScore: number | null;
        retakeOf: string | null;
        applicationId: string;
    }>;
}
