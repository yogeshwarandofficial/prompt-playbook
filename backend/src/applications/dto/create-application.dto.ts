import { IsString, IsOptional, IsEmail, IsInt } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  college?: string;

  @IsString()
  @IsOptional()
  degree?: string;

  @IsInt()
  @IsOptional()
  graduationYear?: number;

  @IsString()
  @IsOptional()
  domainId?: string;

  @IsString()
  @IsOptional()
  specializationId?: string;

  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
