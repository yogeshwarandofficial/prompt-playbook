import { InterviewsService } from './interviews.service';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { RecordInterviewResultDto } from './dto/record-result.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { EmailService } from '../email/email.service';
export declare class InterviewsController {
    private readonly interviewsService;
    private readonly emailService;
    constructor(interviewsService: InterviewsService, emailService: EmailService);
    schedule(dto: ScheduleInterviewDto): Promise<{
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
    update(id: string, dto: UpdateInterviewDto): Promise<{
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
    cancel(id: string): Promise<{
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
    noShow(id: string): Promise<{
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
}
export declare class InterviewsResendController {
    private readonly emailService;
    constructor(emailService: EmailService);
    resendInvite(body: {
        applicantName: string;
        applicantEmail: string;
        scheduledAt: string;
        meetingLink?: string;
    }): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
}
