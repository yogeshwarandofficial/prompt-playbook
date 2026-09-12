import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsOptional()
  repoUrl?: string;

  @IsUrl()
  @IsOptional()
  liveUrl?: string;
}
