import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @MinLength(2, { message: 'Team name must be at least 2 characters' })
  @MaxLength(100, { message: 'Team name cannot exceed 100 characters' })
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: 'Team description cannot exceed 2000 characters' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

