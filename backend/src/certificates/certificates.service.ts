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
import * as QRCode from 'qrcode';

// jimp exposes a v1.x API
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jimp = require('jimp');



@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generateDynamicCertificate(studentProjectId: string, studentId: string): Promise<Buffer> {
    const sp = await this.prisma.studentProject.findUnique({
      where: { id: studentProjectId },
      include: {
        student: true,
        project: true,
        certificate: true
      }
    });

    if (!sp || sp.studentId !== studentId) {
      throw new NotFoundException('Project not found');
    }

    // if (sp.status !== 'COMPLETED') {
    //   throw new BadRequestException('Project is not yet completed');
    // }

    if (!sp.certificate) {
      throw new BadRequestException('Certificate has not been issued yet');
    }

    // Attempt to read the template
    const templatePath = path.join(process.cwd(), '..', 'public', 'template.png');
    let image;
    try {
      image = await jimp.Jimp.read(templatePath);
    } catch (e) {
      throw new BadRequestException('Certificate template not found on server.');
    }

    // Load standard black fonts for a white certificate
    const fontPath64 = path.join(require.resolve('@jimp/plugin-print'), '../../fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt');
    const fontPath32 = path.join(require.resolve('@jimp/plugin-print'), '../../fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');
    const font64 = await jimp.loadFont(fontPath64);
    const font32 = await jimp.loadFont(fontPath32);

    // Print the name
    image.print({
      font: font64,
      x: 0,
      y: image.bitmap.height * 0.40,
      text: {
        text: sp.student.name,
        alignmentX: jimp.HorizontalAlign.CENTER,
        alignmentY: jimp.VerticalAlign.MIDDLE,
      },
      maxWidth: image.bitmap.width,
      maxHeight: 100,
    });

    const startDate = sp.assignedAt ? new Date(sp.assignedAt).toLocaleDateString() : 'N/A';
    const endDate = sp.completedAt ? new Date(sp.completedAt).toLocaleDateString() : new Date().toLocaleDateString();
    const paragraph = `This certificate is proudly presented for successfully completing the ${sp.project.title} Internship at Infynux Solutions from ${startDate} to ${endDate}.`;

    // Print the paragraph
    image.print({
      font: font32,
      x: image.bitmap.width * 0.15,
      y: image.bitmap.height * 0.55,
      text: {
        text: paragraph,
        alignmentX: jimp.HorizontalAlign.CENTER,
        alignmentY: jimp.VerticalAlign.TOP,
      },
      maxWidth: image.bitmap.width * 0.70,
    });

    // Print Date
    image.print({
      font: font32,
      x: image.bitmap.width * 0.20,
      y: image.bitmap.height * 0.82,
      text: new Date().toLocaleDateString(),
    });

    // Print Certificate Code
    image.print({
      font: font32,
      x: image.bitmap.width * 0.20,
      y: image.bitmap.height * 0.88,
      text: sp.certificate.certificateNo,
    });

    // Generate QR code for verification (using Student ID as requested)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const verifyUrl = `${frontendUrl}/verify/${sp.student.studentId}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      margin: 1,
      width: 120, // slightly smaller to fit nicely in the center box
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    const qrImage = await jimp.Jimp.read(qrBuffer);

    // Composite QR code in the bottom center
    const xPos = (image.bitmap.width / 2) - (qrImage.bitmap.width / 2);
    // Approximate y position based on typical certificate layout (bottom portion)
    const yPos = image.bitmap.height - 230;
    
    image.composite(qrImage, xPos > 0 ? xPos : 0, yPos > 0 ? yPos : 0);

    return await image.getBuffer(jimp.JimpMime.png);
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

    // if (sp.status !== 'COMPLETED') {
    //   const incompletePhases = sp.phases.filter((p) => p.status !== 'COMPLETED');
    //   return {
    //     eligible: false,
    //     reason: `Project not completed. Status: ${sp.status}. ${incompletePhases.length} phase(s) still incomplete.`,
    //     studentProject: sp,
    //   };
    // }

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
    const student = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: dto.studentId },
          { studentId: dto.studentId }
        ],
        role: 'STUDENT'
      }
    });

    if (!student) {
      throw new NotFoundException('Student not found with that ID');
    }

    const sp = await this.prisma.studentProject.findFirst({
      where: {
        studentId: student.id,
        // status: 'COMPLETED',
        certificate: null
      },
      orderBy: { assignedAt: 'desc' }
    });

    if (!sp) {
      throw new BadRequestException('This student does not have any completed projects awaiting a certificate.');
    }

    // Re-verify eligibility on the backend
    const { eligible, reason, studentProject } = await this.checkEligibility(sp.id);
    if (!eligible) throw new BadRequestException(reason ?? 'Student is not eligible for a certificate');

    // Check for duplicate
    if (studentProject.certificate) {
      throw new ConflictException('A certificate has already been issued for this internship');
    }

    // Generate unique cert number (retry loop to be safe)
    // Generate unique cert number (IS-IN-000 auto increment)
    let certNo = await this.generateCertNo();

    const verificationToken = randomUUID();

    return this.prisma.certificate.create({
      data: {
        studentId: studentProject.student.id,
        studentProjectId: studentProject.id,
        certificateNo: certNo,
        verificationToken,
        domain: studentProject.project.title,
        specialization: null,
        startDate: studentProject.assignedAt,
        endDate: studentProject.completedAt || new Date(),
        issuedAt: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  private async generateCertNo(): Promise<string> {
    const lastCert = await this.prisma.certificate.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNum = 0;
    if (lastCert && lastCert.certificateNo.startsWith('IS-IN-')) {
      const parts = lastCert.certificateNo.split('-');
      if (parts.length === 3) {
        nextNum = parseInt(parts[2], 10) + 1;
      }
    }

    return `IS-IN-${String(nextNum).padStart(3, '0')}`;
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

  async verifyCertificate(tokenOrCertNo: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [
          { verificationToken: tokenOrCertNo },
          { certificateNo: tokenOrCertNo }
        ]
      },
      include: {
        studentProject: {
          include: {
            student: { select: { name: true, studentId: true } },
            project: { select: { title: true, courseId: true } }
          }
        }
      }
    });

    if (!cert) {
      throw new NotFoundException('Certificate not found or invalid.');
    }

    if (cert.status !== 'ACTIVE') {
      throw new BadRequestException(`This certificate is ${cert.status}. Reason: ${cert.revokeReason || 'Unknown'}`);
    }

    return cert;
  }

  async verifyByStudentId(studentId: string) {
    const certs = await this.prisma.certificate.findMany({
      where: {
        studentProject: {
          student: {
            studentId
          }
        },
        status: 'ACTIVE'
      },
      include: {
        studentProject: {
          include: {
            student: { select: { name: true, studentId: true } },
            project: { select: { title: true, courseId: true } }
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    if (!certs.length) {
      throw new NotFoundException('No active certificates found for this student ID.');
    }

    return certs;
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
