import { Controller, Get, Post, Patch, Body, Param, UseGuards, Res } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { EmailService } from '../email/email.service';
import {
  IssueCertificateDto,
  RevokeCertificateDto,
} from './dto/certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/certificates')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN', 'SUPER_ADMIN')
export class CertificatesController {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly emailService: EmailService,
  ) {}

  @Get('eligible')
  findEligible() {
    return this.certificatesService.findEligible();
  }

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Post('issue')
  issue(@Body() dto: IssueCertificateDto) {
    return this.certificatesService.issue(dto);
  }

  @Post('event')
  async generateEventCertificate(
    @Body() dto: { 
      studentName: string; 
      eventName: string; 
      eventDescription?: string; 
      eventContent?: string; 
      date?: string; 
      certificateCode?: string; 
      verifyUrl?: string;
      recipientEmail?: string;
      download?: boolean;
    }, 
    @Res() res: any
  ) {
    try {
      const defaultVerifyUrl = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'https://infynuxsolutions.in').split(',')[0].trim() + '/verify/EVT-001';
      
      const certResult = await this.certificatesService.generateEventCertificate(
        dto.studentName, 
        dto.eventName,
        dto.eventDescription || 'AN EVENT ORGANIZED BY INFYNUX ACADEMY',
        dto.eventContent || 'in recognition of their participation and efforts.',
        dto.date || new Date().toLocaleDateString(),
        dto.certificateCode || 'EVT-001',
        dto.verifyUrl || defaultVerifyUrl
      );

      let emailSent = false;
      let emailError: string | null = null;

      if (dto.recipientEmail && dto.recipientEmail.trim()) {
        try {
          emailSent = await this.emailService.sendEventCertificate({
            studentName: dto.studentName,
            recipientEmail: dto.recipientEmail.trim(),
            eventName: dto.eventName,
            certificateBuffer: certResult.buffer,
            verifyUrl: certResult.verifyUrl,
            certificateCode: certResult.certificateCode,
          });
          if (!emailSent) {
            emailError = 'Email delivery failed (check mail service logs).';
          }
        } catch (mailErr: any) {
          emailError = mailErr?.message || 'Error sending certificate email';
        }
      }

      // If client requests email-only (no file download stream)
      if (dto.download === false) {
        return res.status(200).json({
          success: true,
          emailSent,
          emailError,
          certificateCode: certResult.certificateCode,
          verifyUrl: certResult.verifyUrl,
          message: emailSent 
            ? `Certificate emailed to ${dto.recipientEmail?.trim()} successfully!` 
            : 'Certificate generated successfully.',
        });
      }

      // Default: Return image buffer download with metadata headers
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="event-certificate-${(dto.certificateCode || certResult.certificateCode || 'IF-EVT').toLowerCase()}.png"`,
        'X-Certificate-Code': certResult.certificateCode,
        'X-Email-Sent': emailSent ? 'true' : 'false',
        'Access-Control-Expose-Headers': 'X-Certificate-Code, X-Email-Sent',
      });
      res.send(certResult.buffer);
    } catch (err: any) {
      return res.status(500).json({
        message: 'Certificate Generation Error',
        error: err.message,
        stack: err.stack,
        details: err.response || err
      });
    }
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string, @Body() dto: RevokeCertificateDto) {
    return this.certificatesService.revoke(id, dto);
  }
}
