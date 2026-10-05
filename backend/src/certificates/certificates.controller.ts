<<<<<<< HEAD
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
=======
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Res } from '@nestjs/common';
>>>>>>> 121c99a (feat: event certificates db tracking and verify qr fix)
import { CertificatesService } from './certificates.service';
import {
  IssueCertificateDto,
  RevokeCertificateDto,
} from './dto/certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

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
      verifyUrl?: string 
    }, 
    @Res() res: any
  ) {
    const buffer = await this.certificatesService.generateEventCertificate(
      dto.studentName, 
      dto.eventName,
      dto.eventDescription || 'AN EVENT ORGANIZED BY INFYNUX ACADEMY',
      dto.eventContent || 'in recognition of their participation and efforts.',
      dto.date || new Date().toLocaleDateString(),
      dto.certificateCode || 'EVT-001',
      dto.verifyUrl || 'https://infynuxsolutions.in'
    );
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="event-certificate.png"',
    });
    res.send(buffer);
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string, @Body() dto: RevokeCertificateDto) {
    return this.certificatesService.revoke(id, dto);
  }
}
