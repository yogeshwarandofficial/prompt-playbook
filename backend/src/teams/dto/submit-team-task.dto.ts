import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class SubmitTeamTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Submission description cannot exceed 5000 characters' })
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Submission URL cannot exceed 1000 characters' })
  @Matches(/^https?:\/\/.+/i, {
    message: 'submissionUrl must be a valid HTTP or HTTPS URL (e.g. GitHub PR or repository link)',
  })
  submissionUrl?: string;
}

