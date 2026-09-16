import { IsString, IsOptional } from 'class-validator';

export class IssueCertificateDto {
  @IsString()
  studentId: string;

  @IsString()
  @IsOptional()
  title?: string;
}

export class RevokeCertificateDto {
  @IsString()
  reason: string;
}
