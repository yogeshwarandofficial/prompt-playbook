import { IsString, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { TeamTaskStatus } from '@prisma/client';

export class CreateTeamTaskDto {
  @IsString()
  @MinLength(2)
  title: string;

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
}
