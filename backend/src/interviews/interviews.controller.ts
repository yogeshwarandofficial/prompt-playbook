import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { RecordInterviewResultDto } from './dto/record-result.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailService } from '../email/email.service';

@Controller('admin/interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly emailService: EmailService,
  ) {}

  @Post('schedule')
  schedule(@Body() dto: ScheduleInterviewDto) {
    return this.interviewsService.scheduleInterview(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.interviewsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInterviewDto) {
    return this.interviewsService.updateInterview(id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.interviewsService.cancelInterview(id);
  }

  @Patch(':id/no-show')
  noShow(@Param('id') id: string) {
    return this.interviewsService.markNoShow(id);
  }

  @Patch(':id/result')
  recordResult(@Param('id') id: string, @Body() dto: RecordInterviewResultDto) {
    return this.interviewsService.recordResult(id, dto);
  }
}

/**
 * POST /api/interviews/resend-invite
 * Unguarded endpoint (only called from the server-side BFF, not the browser).
 * Allows the admin UI to manually re-send an interview invitation email.
 */
@Controller('interviews')
export class InterviewsResendController {
  constructor(private readonly emailService: EmailService) {}

  @Post('resend-invite')
  async resendInvite(
    @Body()
    body: {
      applicantName: string;
      applicantEmail: string;
      scheduledAt: string;
      meetingLink?: string;
    },
  ) {
    const sent = await this.emailService.sendInterviewInvitation({
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      scheduledAt: new Date(body.scheduledAt),
      meetingLink: body.meetingLink,
      interviewId: 'resend',
    });
    if (sent) {
      return { success: true };
    }
    return { success: false, message: 'Email delivery failed.' };
  }
}
