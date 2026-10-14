import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubmitTeamTaskDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  submissionUrl?: string;
}
