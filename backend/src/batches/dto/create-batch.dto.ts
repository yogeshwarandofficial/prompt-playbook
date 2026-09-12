import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { BatchStatus } from '@prisma/client';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsString()
  domainId: string;

  @IsString()
  @IsOptional()
  specializationId?: string;

  @IsString()
  @IsOptional()
  curriculumVersionId?: string;
  
  @IsEnum(BatchStatus)
  status: BatchStatus;

  @IsDateString()
  startDate: string;

  @IsNumber()
  durationWeeks: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
