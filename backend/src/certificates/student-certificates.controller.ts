import { Controller, Get, UseGuards, Req, Param, Res } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('student/certificate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentCertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  getMyCertificate(@Req() req: any) {
    // studentId comes from JWT — never from request body
    return this.certificatesService.getStudentCertificate(req.user.id);
  }

  @Get('download/:studentProjectId')
  async downloadCertificate(@Req() req: any, @Param('studentProjectId') studentProjectId: string, @Res() res: any) {
    const buffer = await this.certificatesService.generateDynamicCertificate(studentProjectId, req.user.id);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="certificate.png"',
    });
    res.send(buffer);
  }
}
