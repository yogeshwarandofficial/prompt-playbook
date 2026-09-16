import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async submit(dto: CreateContactDto, ip: string): Promise<{ success: boolean; message: string }> {
    // Rate-limit: max 5 submissions per IP in the last hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.prisma.contactSubmission.count({
      where: {
        ipAddress: ip,
        createdAt: { gte: hourAgo },
      },
    });

    if (recentCount >= 5) {
      return { success: false, message: 'Too many requests. Please try again later.' };
    }

    // Persist to database
    await this.prisma.contactSubmission.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        subject: dto.subject,
        message: dto.message,
        ipAddress: ip,
      },
    });

    this.logger.log(`Contact form submission from ${dto.email} (IP: ${ip})`);

    // Send emails fire-and-forget — never fail the request if email fails
    this.email
      .sendContactConfirmation({
        name: dto.name,
        email: dto.email.toLowerCase(),
        subject: dto.subject,
        message: dto.message,
      })
      .catch((err) => this.logger.error('Failed to send contact confirmation email', err));

    this.email
      .sendContactAdminNotification({
        name: dto.name,
        email: dto.email.toLowerCase(),
        subject: dto.subject,
        message: dto.message,
        ip,
      })
      .catch((err) => this.logger.error('Failed to send admin notification email', err));

    return { success: true, message: 'Message sent successfully!' };
  }
}
