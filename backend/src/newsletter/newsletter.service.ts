import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async subscribe(rawEmail: string): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
    const email = rawEmail.toLowerCase().trim();

    // Check for existing subscription
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: true, message: "You're already subscribed! 🎉", alreadySubscribed: true };
    }

    // Persist new subscriber
    await this.prisma.newsletterSubscriber.create({
      data: { email },
    });

    this.logger.log(`New newsletter subscriber: ${email}`);

    // Send welcome email fire-and-forget
    this.email
      .sendNewsletterWelcome(email)
      .catch((err) => this.logger.error('Failed to send newsletter welcome email', err));

    return { success: true, message: "You're subscribed! 🎉" };
  }
}
