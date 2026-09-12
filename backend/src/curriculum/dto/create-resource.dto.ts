import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ResourceType } from '@prisma/client';

export class CreateCurriculumResourceDto {
  @IsString()
  title: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
