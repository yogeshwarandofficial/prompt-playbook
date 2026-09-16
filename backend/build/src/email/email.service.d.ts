import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private readonly logger;
    private resend;
    constructor(config: ConfigService);
    private get fromEmail();
    send(opts: {
        to: string | string[];
        subject: string;
        html: string;
        from?: string;
    }): Promise<boolean>;
    sendInterviewInvitation(opts: {
        applicantName: string;
        applicantEmail: string;
        scheduledAt: Date;
        meetingLink?: string | null;
        interviewId: string;
    }): Promise<boolean>;
    sendContactConfirmation(opts: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<boolean>;
    sendContactAdminNotification(opts: {
        name: string;
        email: string;
        subject: string;
        message: string;
        ip: string;
    }): Promise<boolean>;
    sendNewsletterWelcome(email: string): Promise<boolean>;
}
