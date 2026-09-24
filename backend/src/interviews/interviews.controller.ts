import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { RecordInterviewResultDto } from './dto/record-result.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InterviewStatus } from '@prisma/client';

@Controller('admin/interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('schedule')
  schedule(@Body() dto: ScheduleInterviewDto) {
    return this.interviewsService.scheduleInterview(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    // M-3: Validate status to prevent Prisma validation error leaking internal details
    if (status && !Object.values(InterviewStatus).includes(status as InterviewStatus)) {
      throw new BadRequestException(`Invalid status. Allowed: ${Object.values(InterviewStatus).join(', ')}`);
    }
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
