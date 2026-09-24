import { IsString, IsEmail, IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class NotifyInterviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  applicantName: string;

  @IsEmail()
  @IsNotEmpty()
  applicantEmail: string;

  @IsString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsUrl({
    protocols: ['https', 'http'],
    require_protocol: true,
  })
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  interviewId?: string;
}
