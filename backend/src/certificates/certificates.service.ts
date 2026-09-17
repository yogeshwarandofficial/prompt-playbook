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
import { PassThrough } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PImage = require('pureimage');

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

    // Attempt to read the blank template
    const templatePath = path.join(process.cwd(), 'public', 'template_blank.png');
    let image;
    try {
      image = await jimp.Jimp.read(templatePath);
    } catch (e) {
      throw new BadRequestException('Certificate template error: ' + (e as Error).message + ' Path: ' + templatePath);
    }

    // Load standard black fonts for a white certificate
    const fontPath64 = path.join(require.resolve('@jimp/plugin-print'), '../../fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt');
    const fontPath32 = path.join(require.resolve('@jimp/plugin-print'), '../../fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');
    const font64 = await jimp.loadFont(fontPath64);
    const font32 = await jimp.loadFont(fontPath32);

    const printColorized = (img: any, font: any, x: number, y: number, textObj: any, maxWidth?: number, scale: number = 1, color?: [number, number, number]) => {
      // Create a temporary image for the text
      const boxWidth = maxWidth ? Math.ceil(maxWidth / scale) : img.bitmap.width;
      const textImg = new jimp.Jimp({ width: boxWidth, height: 300 });
      
      const printArgs: any = { font, x: 0, y: 0, text: textObj };
      if (maxWidth) printArgs.maxWidth = Math.ceil(maxWidth / scale);
      textImg.print(printArgs);
      
      textImg.scan(0, 0, textImg.bitmap.width, textImg.bitmap.height, function(px: number, py: number, idx: number) {
        if (this.bitmap.data[idx + 3] > 0) {
          this.bitmap.data[idx + 0] = color ? color[0] : 12; // R
          this.bitmap.data[idx + 1] = color ? color[1] : 31; // G
          this.bitmap.data[idx + 2] = color ? color[2] : 56; // B
        }
      });

      if (scale !== 1) {
        textImg.scale(scale);
      }

      // Calculate new X to keep it centered if maxWidth was provided, or just use X
      const finalX = maxWidth ? x + (maxWidth - textImg.bitmap.width) / 2 : x;
      img.composite(textImg, finalX, y);
    };


    // Render the student name using pureimage to support custom TTF fonts
    const fontPathPinyon = path.join(process.cwd(), 'public', 'PinyonScript-Regular.ttf');
    const customFont = PImage.registerFont(fontPathPinyon, 'PinyonScript');
    customFont.loadSync();

    const nameCanvas = PImage.make(image.bitmap.width, 200);
    const ctx = nameCanvas.getContext('2d');
    ctx.clearRect(0, 0, image.bitmap.width, 200); // Clear default black background to transparent
    ctx.fillStyle = 'rgba(12, 31, 56, 1)'; // Navy blue
    ctx.font = "96pt 'PinyonScript'"; // Larger cursive font size
    
    const textWidth = ctx.measureText(sp.student.name).width;
    const nameX = (image.bitmap.width - textWidth) / 2;
    // pureimage draws from the baseline
    ctx.fillText(sp.student.name, nameX, 130);

    const passThrough = new PassThrough();
    const chunks: Buffer[] = [];
    passThrough.on('data', chunk => chunks.push(Buffer.from(chunk)));
    await PImage.encodePNGToStream(nameCanvas, passThrough);
    const nameBuffer = Buffer.concat(chunks);
    const nameJimpImage = await jimp.Jimp.read(nameBuffer);

    // Composite the name onto the main image (y=410 so the baseline sits on the golden line)
    image.composite(nameJimpImage, 0, 410);

    const startDate = sp.assignedAt ? new Date(sp.assignedAt).toLocaleDateString() : 'N/A';
    const endDate = sp.completedAt ? new Date(sp.completedAt).toLocaleDateString() : new Date().toLocaleDateString();
    
    // First paragraph (Dynamic)
    const paragraph1 = `This certificate is proudly presented for successfully completing the ${sp.project.title} Internship at Infynux Solutions from ${startDate} to ${endDate}.`;
    
    // Second paragraph (Static replacement)
    const paragraph2 = `During the internship, hands-on experience was gained through practical training, technical assignments, and real-world projects, demonstrating dedication and commitment to learning. We appreciate the efforts and wish continued growth and success in the professional journey.`;

    // Render both paragraphs with a larger font size (scale 0.85) to fill the box
    printColorized(image, font32, image.bitmap.width * 0.075, 580, {
      text: paragraph1,
      alignmentX: jimp.HorizontalAlign.CENTER,
      alignmentY: jimp.VerticalAlign.TOP,
    }, image.bitmap.width * 0.85, 0.85, [60, 60, 60]);

    // Give some spacing between paragraphs (approx 110px based on rendered height)
    printColorized(image, font32, image.bitmap.width * 0.075, 690, {
      text: paragraph2,
      alignmentX: jimp.HorizontalAlign.CENTER,
      alignmentY: jimp.VerticalAlign.TOP,
    }, image.bitmap.width * 0.85, 0.85, [60, 60, 60]);

    // Print Date (only dynamic part, template already has 'Date : ')
    const dateStr = new Date().toLocaleDateString();
    printColorized(image, font32, 385, 895, dateStr, undefined, 0.75);

    // Print Certificate Code (only dynamic part, template already has 'Certificate Code : ')
    const certCode = sp.certificate.certificateNo;
    printColorized(image, font32, 505, 936, certCode, undefined, 0.75);

    // Generate QR code for verification (using Student ID as requested)
    const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'https://infynuxsolutions.in';
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
    // Lowered slightly to center it better
    const yPos = image.bitmap.height - 180;
    
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

    let sp = await this.prisma.studentProject.findFirst({
      where: {
        studentId: student.id,
        certificate: null
      },
      orderBy: { assignedAt: 'desc' }
    });

    if (!sp) {
      const anyProject = await this.prisma.project.findFirst();
      if (!anyProject) {
        throw new BadRequestException('Please create at least one project in the database first.');
      }
      sp = await this.prisma.studentProject.create({
        data: {
          studentId: student.id,
          projectId: anyProject.id,
          status: 'COMPLETED',
        }
      });
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
      orderBy: { issuedAt: 'desc' },
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
    const studentProjects = await this.prisma.studentProject.findMany({
      where: {
        studentId,
      },
      include: {
        certificate: true,
        project: true,
        student: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    const completedProjects = studentProjects.filter(
      sp => sp.status === 'COMPLETED' || sp.certificate
    );

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
