import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { RecordInterviewResultDto } from './dto/record-result.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  private readonly logger = new Logger(InterviewsService.name);
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async scheduleInterview(dto: ScheduleInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
    });
    if (!application) throw new NotFoundException('Application not found');

    // Application must be at least SHORTLISTED or UNDER_REVIEW
    if (application.status === 'PENDING' || application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      throw new BadRequestException(
        `Cannot schedule interview for application with status: ${application.status}. Must be SHORTLISTED or UNDER_REVIEW.`
      );
    }

    // Check if an active interview already exists
    const existing = await this.prisma.interview.findFirst({
      where: {
        applicationId: dto.applicationId,
        status: 'SCHEDULED',
      },
    });
    if (existing) {
      throw new ConflictException('An active interview is already scheduled for this application');
    }

    // Update application status to SHORTLISTED if it was UNDER_REVIEW
    if (application.status === 'UNDER_REVIEW') {
      await this.prisma.application.update({
        where: { id: dto.applicationId },
        data: { status: 'SHORTLISTED' },
      });
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        meetingLink: dto.meetingLink,
        interviewerId: dto.interviewerId,
        status: 'SCHEDULED',
        result: 'PENDING',
      },
      include: {
        application: { select: { name: true, email: true, status: true } },
      },
    });

    // Send invitation email immediately after persisting — fire-and-forget, never blocks the response
    if (interview.application?.email && interview.scheduledAt) {
      this.email
        .sendInterviewInvitation({
          applicantName: interview.application.name,
          applicantEmail: interview.application.email,
          scheduledAt: interview.scheduledAt,
          meetingLink: interview.meetingLink,
          interviewId: interview.id,
        })
        .catch((err) => this.logger.error('Failed to send interview invitation email', err));
    }

    return interview;
  }

  async findAll(status?: string) {
    return this.prisma.interview.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { scheduledAt: 'asc' },
      include: {
        application: {
          select: { id: true, name: true, email: true, phone: true, status: true, domainId: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: true,
      },
    });
    if (!interview) throw new NotFoundException(`Interview #${id} not found`);
    return interview;
  }

  async updateInterview(id: string, dto: UpdateInterviewDto) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');
    if (interview.status !== 'SCHEDULED') {
      throw new BadRequestException('Can only update SCHEDULED interviews');
    }
    return this.prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        meetingLink: dto.meetingLink,
        interviewerId: dto.interviewerId,
      },
    });
  }

  async cancelInterview(id: string) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');
    if (interview.status !== 'SCHEDULED') {
      throw new BadRequestException('Can only cancel SCHEDULED interviews');
    }
    return this.prisma.interview.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async recordResult(id: string, dto: RecordInterviewResultDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: { application: true },
    });
    if (!interview) throw new NotFoundException('Interview not found');
    if (interview.status !== 'SCHEDULED') {
      throw new BadRequestException('Can only record result for SCHEDULED interviews');
    }

    return this.prisma.$transaction(async (tx) => {
      // Update interview to COMPLETED with result
      const updated = await tx.interview.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          result: dto.result,
          feedback: dto.feedback,
          technicalScore: dto.technicalScore,
          projectScore: dto.projectScore,
          communicationScore: dto.communicationScore,
          overallScore: dto.overallScore,
        },
        include: {
          application: { select: { id: true, name: true, email: true } },
        },
      });

      // Mirror result onto the Application
      let newAppStatus: any = interview.application.status;
      if (dto.result === 'SELECTED') newAppStatus = 'ACCEPTED';
      else if (dto.result === 'REJECTED') newAppStatus = 'REJECTED';
      // ON_HOLD / PENDING keep current status

      await tx.application.update({
        where: { id: interview.applicationId },
        data: { status: newAppStatus },
      });

      return updated;
    });
  }

  async markNoShow(id: string) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');
    if (interview.status !== 'SCHEDULED') {
      throw new BadRequestException('Can only mark SCHEDULED interviews as NO_SHOW');
    }
    return this.prisma.interview.update({
      where: { id },
      data: { status: 'NO_SHOW' as any },
    });
  }
}
