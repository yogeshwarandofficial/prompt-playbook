import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCurriculumDto {
  @IsString()
  domainId: string;

  @IsString()
  @IsOptional()
  specializationId?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
