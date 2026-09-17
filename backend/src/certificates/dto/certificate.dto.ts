import { IsString, IsOptional } from 'class-validator';

export class IssueCertificateDto {
  @IsString()
  studentId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  courseId?: string;
}

export class RevokeCertificateDto {
  @IsString()
  reason: string;
}
