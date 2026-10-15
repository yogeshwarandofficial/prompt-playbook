import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(2, { message: 'Team name must be at least 2 characters' })
  @MaxLength(100, { message: 'Team name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: 'Team description cannot exceed 2000 characters' })
  description?: string;
}

