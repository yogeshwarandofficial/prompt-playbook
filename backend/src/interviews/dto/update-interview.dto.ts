import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateInterviewDto {
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  interviewerId?: string;
}
