import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';
import { randomUUID } from 'crypto';
import * as path from 'path';

// jimp exposes a v0.x-style flat API via its default/CJS export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Jimp = require('jimp');

function generateCertNo(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `INFY-${year}-${rand}`;
}

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generateDynamicCertificate(studentProjectId: string, studentId: string): Promise<Buffer> {
    const sp = await this.prisma.studentProject.findUnique({
      where: { id: studentProjectId },
      include: {
        student: true,
        project: true
      }
    });

    if (!sp || sp.studentId !== studentId) {
      throw new NotFoundException('Project not found');
    }

    if (sp.status !== 'COMPLETED') {
      throw new BadRequestException('Project is not yet completed');
    }

    // Attempt to read the template
    const templatePath = path.join(process.cwd(), 'assets', 'certificate_template.png');
    let image;
    try {
      image = await Jimp.read(templatePath);
    } catch (e) {
      throw new BadRequestException('Certificate template not found on server.');
    }

    // Add student name (Top Center)
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

    // Print the name at the top (x=0, y=50, width=1000 to center)
    image.print(
      font,
      0,
      50,
      {
        text: sp.student.name,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      1000,
      100,
    );

    return await image.getBuffer(Jimp.MIME_PNG);
  }

  /**
   * Determines eligibility: ALL project phases must be COMPLETED and
   * StudentProject must be COMPLETED.
   */
  async checkEligibility(studentProjectId: string): Promise<{
    eligible: boolean;
    reason?: string;
    studentProject?: any;
  }> {
    const sp = await this.prisma.studentProject.findUnique({
      where: { id: studentProjectId },
      include: {
        phases: { include: { submissions: { include: { reviews: true } } } },
        student: { select: { id: true, name: true, email: true, studentId: true } },
        project: { select: { id: true, title: true } },
        certificate: true,
      },
    });
    if (!sp) throw new NotFoundException('StudentProject not found');

    if (sp.status !== 'COMPLETED') {
      const incompletePhases = sp.phases.filter((p) => p.status !== 'COMPLETED');
      return {
        eligible: false,
        reason: `Project not completed. Status: ${sp.status}. ${incompletePhases.length} phase(s) still incomplete.`,
        studentProject: sp,
      };
    }

    return { eligible: true, studentProject: sp };
  }

  /** List all COMPLETED StudentProjects that don't yet have a certificate. */
  async findEligible() {
    const completedProjects = await this.prisma.studentProject.findMany({
      where: { status: 'COMPLETED', certificate: null },
      include: {
        student: { select: { id: true, name: true, email: true, studentId: true } },
        project: { select: { id: true, title: true } },
        phases: {
          select: { status: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
    return completedProjects;
  }

  /** List all issued certificates. */
  async findAll() {
    return this.prisma.certificate.findMany({
      include: {
        studentProject: {
          include: {
            student: { select: { id: true, name: true, email: true, studentId: true } },
            project: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        studentProject: {
          include: {
            student: { select: { id: true, name: true, email: true, studentId: true } },
            project: { select: { id: true, title: true } },
          },
        },
      },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    return cert;
  }

  async issue(dto: IssueCertificateDto) {
    // Re-verify eligibility on the backend
    const { eligible, reason, studentProject } = await this.checkEligibility(dto.studentProjectId);
    if (!eligible) throw new BadRequestException(reason ?? 'Student is not eligible for a certificate');

    // Check for duplicate
    if (studentProject.certificate) {
      throw new ConflictException('A certificate has already been issued for this internship');
    }

    // Generate unique cert number (retry loop to be safe)
    let certNo: string;
    let attempts = 0;
    do {
      certNo = generateCertNo();
      const dup = await this.prisma.certificate.findUnique({ where: { certificateNo: certNo } });
      if (!dup) break;
      attempts++;
    } while (attempts < 5);

    const verificationToken = randomUUID();

    return this.prisma.certificate.create({
      data: {
        studentId: studentProject.student.id,
        studentProjectId: dto.studentProjectId,
        certificateNo: certNo,
        verificationToken,
        domain: studentProject.project.title,
        specialization: null,
        startDate: studentProject.assignedAt,
        endDate: studentProject.completedAt!,
        issuedAt: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  async revoke(id: string, dto: RevokeCertificateDto) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (cert.status === 'REVOKED') throw new BadRequestException('Certificate is already revoked');

    return this.prisma.certificate.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokeReason: dto.reason,
      },
    });
  }

  /** Student-facing: get their own certificate status by studentId */
  async getStudentCertificate(studentId: string) {
    const completedProjects = await this.prisma.studentProject.findMany({
      where: { studentId, status: 'COMPLETED' },
      include: {
        certificate: true,
        project: true,
        student: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    // Map completed projects to look like certificates for the frontend
    return completedProjects.map((sp) => {
      if (sp.certificate) {
        return {
          ...sp.certificate,
          studentProject: sp,
        };
      }
      
      // If no certificate record exists yet, mock one for dynamic downloading
      return {
        id: sp.id, // Use project id as a fallback
        studentId: sp.studentId,
        studentProjectId: sp.id,
        certificateNo: `PENDING-${sp.id.substring(0,6).toUpperCase()}`,
        verificationToken: sp.id,
        status: 'ACTIVE',
        issuedAt: sp.completedAt || new Date(),
        studentProject: sp,
      };
    });
  }
}
