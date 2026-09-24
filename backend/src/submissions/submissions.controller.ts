import { Controller, Post, Get, Body, Param, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SubmissionStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // ── STUDENT ENDPOINTS ───────────────────────────────────────────────────────

  /** Submit work for a specific StudentProjectPhase */
  @Post('student/phases/:phaseId/submit')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  submitPhase(
    @Req() req: any,
    @Param('phaseId') phaseId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.submitPhase(req.user.id, phaseId, dto);
  }

  /** Get submission history for a specific StudentProjectPhase */
  @Get('student/phases/:phaseId/submissions')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  getPhaseSubmissions(@Req() req: any, @Param('phaseId') phaseId: string) {
    return this.submissionsService.getPhaseSubmissions(req.user.id, phaseId);
  }

  /** Get student's assigned projects with phase timeline */
  @Get('student/projects')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  getMyProjects(@Req() req: any) {
    return this.submissionsService.getMyProjects(req.user.id);
  }

  // ── ADMIN/MENTOR ENDPOINTS ──────────────────────────────────────────────────

  /** List all submissions (defaults to SUBMITTED + UNDER_REVIEW) */
  @Get('admin/submissions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'MENTOR')
  getAdminSubmissions(@Query('status') status?: string) {
    // M-3: Guard against invalid status values to prevent Prisma internal error exposure
    if (status && !Object.values(SubmissionStatus).includes(status as SubmissionStatus)) {
      throw new BadRequestException(`Invalid status. Allowed: ${Object.values(SubmissionStatus).join(', ')}`);
    }
    return this.submissionsService.getAdminSubmissions(status);
  }

  /** Get a specific submission with full review history */
  @Get('admin/submissions/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'MENTOR')
  getSubmission(@Param('id') id: string) {
    return this.submissionsService.getSubmission(id);
  }

  /** Submit a review decision (Approve / Request Changes / Reject) */
  @Post('admin/submissions/:id/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'MENTOR')
  review(@Req() req: any, @Param('id') id: string, @Body() dto: CreateReviewDto) {
    return this.submissionsService.reviewSubmission(req.user.id, id, dto);
  }
}
