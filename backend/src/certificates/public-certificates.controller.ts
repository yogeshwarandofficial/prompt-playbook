import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('public/certificates')
export class PublicCertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('verify/:token')
  verifyCertificate(@Param('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token or Certificate Number is required');
    }
    return this.certificatesService.verifyCertificate(token);
  }

  @Get('student/:studentId')
  verifyByStudentId(@Param('studentId') studentId: string) {
    if (!studentId) {
      throw new BadRequestException('Student ID is required');
    }
    return this.certificatesService.verifyByStudentId(studentId);
  }
}
