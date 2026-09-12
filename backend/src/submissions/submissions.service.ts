import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AutomatedReviewService } from '../automated-review/automated-review.service';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private automatedReview: AutomatedReviewService,
  ) {}

  // ── STUDENT: Submit work for a phase ──────────────────────────────────────

  async submitPhase(userId: string, studentProjectPhaseId: string, dto: CreateSubmissionDto) {
    // Verify the StudentProjectPhase belongs to this student
    const spp = await this.prisma.studentProjectPhase.findUnique({
      where: { id: studentProjectPhaseId },
      include: { studentProject: true },
    });
    if (!spp || spp.studentProject.studentId !== userId) {
      throw new NotFoundException('Phase not found');
    }

    // Enforce state machine — only these statuses allow submission
    const submittableStatuses: string[] = ['AVAILABLE', 'IN_PROGRESS', 'CHANGES_REQUESTED'];
    if (!submittableStatuses.includes(spp.status)) {
      throw new ForbiddenException(
        `Cannot submit: phase is currently ${spp.status}. Only AVAILABLE, IN_PROGRESS, or CHANGES_REQUESTED phases can be submitted.`,
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Create new submission row (preserves history)
      const submission = await tx.submission.create({
        data: {
          studentProjectPhaseId,
          content: dto.content,
          repoUrl: dto.repoUrl ?? null,
          liveUrl: dto.liveUrl ?? null,
          status: 'SUBMITTED',
        },
      });

      // Update phase status
      await tx.studentProjectPhase.update({
        where: { id: studentProjectPhaseId },
        data: { status: 'SUBMITTED' },
      });

      // Update project status to IN_PROGRESS if still ASSIGNED
      if (spp.studentProject.status === 'ASSIGNED') {
        await tx.studentProject.update({
          where: { id: spp.studentProject.id },
          data: { status: 'IN_PROGRESS' },
        });
      }

      return submission;
    });

    // Trigger automated review asynchronously — advisory only, does not block
    this.automatedReview.triggerForSubmission(result.id).catch(() => {});

    return result;
  }

  // ── STUDENT: Get my submissions for a phase ───────────────────────────────

  async getPhaseSubmissions(userId: string, studentProjectPhaseId: string) {
    const spp = await this.prisma.studentProjectPhase.findUnique({
      where: { id: studentProjectPhaseId },
      include: { studentProject: true },
    });
    if (!spp || spp.studentProject.studentId !== userId) {
      throw new NotFoundException('Phase not found');
    }
    return this.prisma.submission.findMany({
      where: { studentProjectPhaseId },
      include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  // ── STUDENT: Get my assigned projects with full phase timeline ─────────────

  async getMyProjects(userId: string) {
    return this.prisma.studentProject.findMany({
      where: { studentId: userId },
      include: {
        project: {
          include: {
            phases: { orderBy: { phaseOrder: 'asc' } },
            course: { select: { id: true, name: true } },
          },
        },
        phases: {
          include: {
            phase: true,
            submissions: {
              include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
              orderBy: { submittedAt: 'desc' },
              take: 5,
            },
          },
          orderBy: { phase: { phaseOrder: 'asc' } },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  // ── ADMIN: List all submissions, with optional status filter ──────────────

  async getAdminSubmissions(status?: string) {
    return this.prisma.submission.findMany({
      where: status ? { status: status as any } : { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      include: {
        studentProjectPhase: {
          include: {
            phase: true,
            studentProject: {
              include: {
                student: { select: { id: true, name: true, studentId: true } },
                project: { select: { id: true, title: true } },
              },
            },
          },
        },
        reviews: { include: { reviewer: { select: { name: true, role: true } } } },
        automatedReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getSubmission(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        studentProjectPhase: {
          include: {
            phase: true,
            studentProject: {
              include: {
                student: { select: { id: true, name: true, studentId: true, email: true } },
                project: { select: { id: true, title: true } },
              },
            },
          },
        },
        reviews: { include: { reviewer: { select: { id: true, name: true, role: true } } }, orderBy: { reviewedAt: 'desc' } },
        automatedReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  // ── ADMIN: Review a submission — state machine enforced in transaction ─────

  async reviewSubmission(reviewerId: string, submissionId: string, dto: CreateReviewDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        studentProjectPhase: {
          include: {
            phase: true,
            studentProject: {
              include: { project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } } },
            },
          },
        },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    // Only SUBMITTED or UNDER_REVIEW submissions can be reviewed
    if (!['SUBMITTED', 'UNDER_REVIEW'].includes(submission.status)) {
      throw new BadRequestException(`Cannot review a submission with status ${submission.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Record the review (never overwrite — always create new)
      await tx.review.create({
        data: {
          submissionId,
          reviewerId,
          decision: dto.decision,
          feedback: dto.feedback,
        },
      });

      const spp = submission.studentProjectPhase;
      const sp = spp.studentProject;

      if (dto.decision === 'APPROVED') {
        // Mark submission approved
        await tx.submission.update({ where: { id: submissionId }, data: { status: 'APPROVED' } });
        // Mark phase completed
        await tx.studentProjectPhase.update({
          where: { id: spp.id },
          data: { status: 'COMPLETED' },
        });

        // Find next phase
        const currentPhaseOrder = spp.phase?.phaseOrder;
        let nextPhase: any = null;
        if (currentPhaseOrder !== undefined) {
          // We need the full phase info — fetch it
          const currentPhaseData = await tx.projectPhase.findUnique({ where: { id: spp.phaseId } });
          if (currentPhaseData) {
            nextPhase = await tx.projectPhase.findFirst({
              where: { projectId: sp.projectId, phaseOrder: currentPhaseData.phaseOrder + 1 },
            });
          }
        }

        if (nextPhase) {
          // Unlock next StudentProjectPhase
          await tx.studentProjectPhase.updateMany({
            where: { studentProjectId: sp.id, phaseId: nextPhase.id },
            data: { status: 'AVAILABLE' },
          });
        } else {
          // No next phase — internship is complete
          await tx.studentProject.update({
            where: { id: sp.id },
            data: { status: 'COMPLETED', completedAt: new Date() },
          });
        }

      } else if (dto.decision === 'CHANGES_REQUESTED') {
        await tx.submission.update({ where: { id: submissionId }, data: { status: 'CHANGES_REQUESTED' } });
        await tx.studentProjectPhase.update({
          where: { id: spp.id },
          data: { status: 'CHANGES_REQUESTED' },
        });
        // Next phase remains LOCKED — no action needed

      } else if (dto.decision === 'REJECTED') {
        await tx.submission.update({ where: { id: submissionId }, data: { status: 'REJECTED' } });
        // Phase returns to AVAILABLE so student can resubmit or admin can intervene
        await tx.studentProjectPhase.update({
          where: { id: spp.id },
          data: { status: 'AVAILABLE' },
        });
        // Next phase remains LOCKED — no action needed
      }

      return tx.submission.findUnique({
        where: { id: submissionId },
        include: {
          reviews: { orderBy: { reviewedAt: 'desc' } },
          studentProjectPhase: { select: { id: true, status: true } },
        },
      });
    });
  }
}
