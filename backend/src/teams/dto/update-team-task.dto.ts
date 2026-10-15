import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
} from 'class-validator';
import { TeamTaskStatus } from '@prisma/client';

export class UpdateTeamTaskDto {
  @IsString()
  @MinLength(2, { message: 'Task title must be at least 2 characters' })
  @MaxLength(200, { message: 'Task title cannot exceed 200 characters' })
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20000, { message: 'Task description cannot exceed 20000 characters' })
  description?: string;

  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;

  @IsEnum(TeamTaskStatus)
  @IsOptional()
  status?: TeamTaskStatus;

  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Task links cannot exceed 5000 characters' })
  @Matches(/(https?:\/\/[^\s]+)/i, { message: 'Task links must contain valid http:// or https:// URL(s)' })
  taskUrl?: string;


  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Submission content cannot exceed 5000 characters' })
  submissionContent?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Submission URL cannot exceed 1000 characters' })
  @Matches(/^https?:\/\/.+/i, { message: 'submissionUrl must be a valid HTTP or HTTPS URL' })
  submissionUrl?: string;
}

