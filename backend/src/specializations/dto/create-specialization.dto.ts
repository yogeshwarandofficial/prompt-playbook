import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSpecializationDto {
  @IsString()
  domainId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
