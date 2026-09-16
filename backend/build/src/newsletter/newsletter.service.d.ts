import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class NewsletterService {
    private prisma;
    private email;
    private readonly logger;
    constructor(prisma: PrismaService, email: EmailService);
    subscribe(rawEmail: string): Promise<{
        success: boolean;
        message: string;
        alreadySubscribed?: boolean;
    }>;
}
