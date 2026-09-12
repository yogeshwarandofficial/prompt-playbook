import { IsString, IsOptional } from 'class-validator';

export class IssueCertificateDto {
  @IsString()
  studentProjectId: string;

  @IsString()
  @IsOptional()
  title?: string;
}

export class RevokeCertificateDto {
  @IsString()
  reason: string;
}
