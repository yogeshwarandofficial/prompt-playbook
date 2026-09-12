import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { IssueCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';
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

  @Patch(':id/revoke')
  revoke(@Param('id') id: string, @Body() dto: RevokeCertificateDto) {
    return this.certificatesService.revoke(id, dto);
  }
}
