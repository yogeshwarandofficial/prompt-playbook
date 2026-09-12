import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class ScheduleInterviewDto {
  @IsString()
  applicationId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  interviewerId?: string;
}
