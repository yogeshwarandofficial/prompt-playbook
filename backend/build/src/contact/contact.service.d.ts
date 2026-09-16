import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private prisma;
    private email;
    private readonly logger;
    constructor(prisma: PrismaService, email: EmailService);
    submit(dto: CreateContactDto, ip: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
