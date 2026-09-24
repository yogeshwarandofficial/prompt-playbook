import { IsString, IsOptional, IsEmail, IsInt, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  college?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  degree?: string;

  @IsInt()
  @IsOptional()
  graduationYear?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  domainId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  specializationId?: string;

  /**
   * resumeUrl — accepts EITHER:
   *   a) a base64 Data URI for PDF, DOC, or DOCX files (capped at ~1 MB encoded)
   *   b) an https:// URL pointing to a hosted resume
   *
   * Security controls:
   *   - Rejects javascript:, data:<other type>, and all arbitrary schemes
   *   - Caps payload size to prevent storage-bomb / DoS via public endpoint
   */
  @IsString()
  @IsOptional()
  @MaxLength(1_400_000, { message: 'Resume file must be under 1 MB' })
  @Matches(
    /^(data:application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document);base64,[A-Za-z0-9+/]+=*$|https:\/\/.+)/,
    {
      message:
        'resumeUrl must be a base64-encoded PDF/DOC/DOCX (data URI) or a public https:// URL',
    },
  )
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  message?: string;
}
