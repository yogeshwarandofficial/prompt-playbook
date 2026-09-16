import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  repoUrl?: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  liveUrl?: string;
}
