import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * AutomatedReviewService — ADVISORY ONLY
 *
 * This service provides a stub/mock automated review. It analyses submission
 * content heuristically and saves the result as an AutomatedReview record.
 *
 * CRITICAL CONSTRAINTS:
 *  - This service NEVER approves, rejects, or changes submission status.
 *  - This service NEVER unlocks a phase.
 *  - This service NEVER issues certificates.
 *  - Human review remains the ONLY authority for state transitions.
 *  - The result is labelled "Advisory" in all UIs.
 */
@Injectable()
export class AutomatedReviewService {
  private readonly logger = new Logger(AutomatedReviewService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Trigger automated review for a submission.
   * Called by SubmissionsService after a submission is created.
   * Runs asynchronously — does not block submission creation.
   */
  async triggerForSubmission(submissionId: string): Promise<void> {
    try {
      // Create a PENDING automated review record immediately
      const autoReview = await this.prisma.automatedReview.create({
        data: {
          submissionId,
          status: 'PENDING',
        },
      });

      // Run mock analysis asynchronously (no await from caller)
      this.runMockAnalysis(autoReview.id, submissionId).catch((err) =>
        this.logger.error(`Automated review failed for submission ${submissionId}: ${err.message}`)
      );
    } catch (err) {
      // Advisory system — log and continue; do NOT throw
      this.logger.error(`Failed to create AutomatedReview record: ${err.message}`);
    }
  }

  private async runMockAnalysis(autoReviewId: string, submissionId: string): Promise<void> {
    // Simulate a short processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        studentProjectPhase: {
          include: { phase: { select: { title: true } } },
        },
      },
    });

    if (!submission) {
      await this.prisma.automatedReview.update({
        where: { id: autoReviewId },
        data: { status: 'FAILED' },
      });
      return;
    }

    // Heuristic analysis of submission content
    const content = submission.content || '';
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 70; // baseline advisory score

    if (content.length < 50) {
      issues.push('Submission description is very short — consider adding more detail.');
      score -= 15;
    }
    if (!submission.repoUrl) {
      issues.push('No repository URL provided.');
      suggestions.push('Add a public GitHub repository link.');
      score -= 10;
    } else if (!submission.repoUrl.includes('github.com') && !submission.repoUrl.includes('gitlab.com')) {
      suggestions.push('Ensure the repository is publicly accessible on GitHub or GitLab.');
    }
    if (!submission.liveUrl) {
      suggestions.push('Consider deploying and sharing a live demo URL.');
    }
    if (content.includes('TODO') || content.includes('WIP')) {
      issues.push('Submission mentions TODO/WIP — ensure work is complete before submitting.');
      score -= 10;
    }

    const phase = submission.studentProjectPhase?.phase?.title ?? 'this phase';
    const summary = issues.length === 0
      ? `Automated check for "${phase}" passed basic validation. ${score}/100 advisory score. Human review required for final decision.`
      : `Automated check for "${phase}" flagged ${issues.length} item(s) for human reviewer attention. ${score}/100 advisory score. This is advisory only — human review is authoritative.`;

    await this.prisma.automatedReview.update({
      where: { id: autoReviewId },
      data: {
        status: 'COMPLETED',
        summary,
        detectedIssues: issues,
        suggestions,
        score: Math.max(0, score),
      },
    });
  }

  /** Get the automated review for a submission (for reviewer UI) */
  async getForSubmission(submissionId: string) {
    return this.prisma.automatedReview.findFirst({
      where: { submissionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
