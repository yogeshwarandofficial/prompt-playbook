import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { InterviewResult } from '@prisma/client';

export class RecordInterviewResultDto {
  @IsEnum(InterviewResult)
  result: InterviewResult;

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  technicalScore?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  projectScore?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  communicationScore?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  overallScore?: number;
}
