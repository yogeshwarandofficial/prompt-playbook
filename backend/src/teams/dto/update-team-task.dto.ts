import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TeamTaskStatus } from '@prisma/client';

export class UpdateTeamTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TeamTaskStatus)
  @IsOptional()
  status?: TeamTaskStatus;

  @IsString()
  @IsOptional()
  taskUrl?: string;

  @IsString()
  @IsOptional()
  submissionContent?: string;

  @IsString()
  @IsOptional()
  submissionUrl?: string;
}
