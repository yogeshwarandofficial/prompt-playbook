import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { CurriculumPhaseType } from '@prisma/client';

export class CreateCurriculumPhaseDto {
  @IsNumber()
  phaseNumber: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsNumber()
  @IsOptional()
  durationDays?: number;

  @IsEnum(CurriculumPhaseType)
  @IsOptional()
  phaseType?: CurriculumPhaseType;

  @IsString()
  @IsOptional()
  googleSheetUrl?: string;

  @IsString()
  @IsOptional()
  sheetVisibleFrom?: string;

  @IsBoolean()
  @IsOptional()
  requiresGitHub?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresLiveDemo?: boolean;

  @IsString()
  @IsOptional()
  projectId?: string;
  
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
