import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';
import { randomUUID } from 'crypto';

function generateCertNo(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `INFY-${year}-${rand}`;
}

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

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
    // Find all their completed projects
    const completedProjects = await this.prisma.studentProject.findMany({
      where: { studentId, status: 'COMPLETED' },
      include: {
        certificate: true,
        project: { select: { id: true, title: true } },
        phases: { select: { status: true } },
      },
      orderBy: { completedAt: 'desc' },
    });

    if (completedProjects.length === 0) {
      // Check if any project is in progress to give a helpful reason
      const activeProject = await this.prisma.studentProject.findFirst({
        where: { studentId, status: { in: ['ASSIGNED', 'IN_PROGRESS'] } },
        include: {
          project: { select: { title: true } },
          phases: { select: { status: true } },
        },
      });

      return {
        eligibility: 'NOT_ELIGIBLE',
        reason: activeProject
          ? `Your internship project "${activeProject.project.title}" is still in progress. Complete all phases to become eligible.`
          : 'No active or completed internship project found.',
        certificate: null,
      };
    }

    // Use the most recently completed project
    const sp = completedProjects[0];

    if (sp.certificate) {
      return {
        eligibility: sp.certificate.status === 'REVOKED' ? 'REVOKED' : 'ISSUED',
        certificate: sp.certificate,
        projectTitle: sp.project.title,
      };
    }

    return {
      eligibility: 'ELIGIBLE',
      reason: 'Your internship is complete. Your certificate will be issued by an administrator.',
      certificate: null,
      projectTitle: sp.project.title,
    };
  }
}
