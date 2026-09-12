import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import * as bcrypt from 'bcrypt';

import { Resend } from 'resend';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        status: 'PENDING',
      },
    });

    // Fire off emails asynchronously without blocking the response
    this.sendApplicationEmails(application).catch(e => console.error("Email error:", e));

    return application;
  }

  private async sendApplicationEmails(app: any) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not found. Skipping emails.');
      return;
    }
    
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    // Parse the Data URI to extract the base64 content
    let resumeData = undefined;
    let resumeType = 'application/pdf';
    let resumeName = 'resume.pdf';

    if (app.resumeUrl && app.resumeUrl.startsWith('data:')) {
      const parts = app.resumeUrl.split(',');
      if (parts.length === 2) {
        resumeData = parts[1];
        const mimeMatch = parts[0].match(/data:(.*?);/);
        if (mimeMatch) {
          resumeType = mimeMatch[1];
          const ext = resumeType.split('/')[1] || 'pdf';
          resumeName = `resume.${ext}`;
        }
      }
    }
    
    // 1. Applicant Confirmation
    await resend.emails.send({
      from: `Infynux Academy <${fromEmail}>`,
      to: app.email,
      subject: "Internship Application Received — Infynux Academy 🚀",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
          <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">Hello ${app.name},</h2>
          <p style="font-size:16px;line-height:1.5;color:#374151">Thank you for applying for the <strong>${app.domainId || 'General'}</strong> internship at Infynux Academy.</p>
          <p style="font-size:16px;line-height:1.5;color:#374151">Our team will review your profile and get back to you within <strong>2–3 business days</strong>.</p>
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;font-size:14px">
            <p style="margin:0;font-weight:bold;color:#374151">Application Summary:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#4b5563">
              <li><strong>Domain:</strong> ${app.domainId || 'General'}</li>
              <li><strong>Sub-domain:</strong> ${app.specializationId || "Not specified"}</li>
              <li><strong>College:</strong> ${app.college || "Not specified"}</li>
              <li><strong>Mobile:</strong> ${app.phone || "Not specified"}</li>
            </ul>
          </div>
          <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
          <p style="font-size:14px;font-weight:600;color:#374151">— The Infynux Academy Team</p>
        </div>
      `,
    });

    // 2. Admin Notification
    const adminTo = process.env.RESEND_TO_EMAIL_OVERRIDE || "support@infynuxsolutions.in";
    const attachments = [];
    if (resumeData) {
      attachments.push({
        filename: resumeName,
        content: resumeData,
        contentType: resumeType,
      });
    }

    await resend.emails.send({
      from: `Infynux System <${fromEmail}>`,
      to: adminTo,
      subject: `New Internship Application: ${app.name} (${app.domainId || 'General'})`,
      attachments,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
          <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">New Internship Application</h2>
          <table style="font-size:14px;line-height:1.8;color:#374151;width:100%">
            <tr><td><strong>Name:</strong></td><td>${app.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${app.email}</td></tr>
            <tr><td><strong>Mobile:</strong></td><td>${app.phone || 'N/A'}</td></tr>
            <tr><td><strong>College:</strong></td><td>${app.college || 'N/A'}</td></tr>
            <tr><td><strong>Domain:</strong></td><td>${app.domainId || 'None'} — ${app.specializationId || 'None'}</td></tr>
            <tr><td><strong>Resume:</strong></td><td>${resumeData ? `📎 ${resumeName} (attached)` : 'No resume uploaded'}</td></tr>
          </table>
          ${app.message ? `
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
            <p style="margin:0;font-weight:bold">Message:</p>
            <p style="margin:8px 0 0;white-space:pre-wrap">${app.message}</p>
          </div>` : ""}
        </div>
      `,
    });
  }

  findAll(status?: string) {
    return this.prisma.application.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(`Application #${id} not found`);
    }
    return application;
  }

  async reviewApplication(id: string, reviewerId: string, dto: ReviewApplicationDto) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');

    if (application.status === 'ACCEPTED') {
      throw new BadRequestException('Application already accepted');
    }

    if (dto.status === 'SHORTLISTED') {
      return this.prisma.application.update({
        where: { id },
        data: {
          status: 'SHORTLISTED',
          reviewNotes: dto.reviewNotes,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      let createdUserId = null;

      // If accepted, generate a user account
      if (dto.status === 'ACCEPTED') {
        // Check if user already exists
        const existing = await tx.user.findFirst({
          where: { email: application.email }
        });

        if (existing) {
          throw new ConflictException('User with this email already exists');
        }

        // Generate student ID (simple format for demo)
        const studentId = `INFY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const salt = await bcrypt.genSalt(10);
        // Default password for new students
        const passwordHash = await bcrypt.hash('password123', salt);

        const newUser = await tx.user.create({
          data: {
            studentId,
            name: application.name,
            email: application.email,
            passwordHash,
            role: 'STUDENT',
            phone: application.phone,
            college: application.college,
            degree: application.degree,
            graduationYear: application.graduationYear,
            domainId: application.domainId,
            specializationId: application.specializationId,
            batchId: dto.batchId,
          }
        });

        createdUserId = newUser.id;

        // If batch & curriculum provided, enroll student
        if (dto.batchId && dto.curriculumVersionId) {
          const batch = await tx.batch.findUnique({ where: { id: dto.batchId } });
          if (batch) {
            const enrollment = await tx.studentCurriculumEnrollment.create({
              data: {
                studentId: newUser.id,
                batchId: batch.id,
                curriculumVersionId: dto.curriculumVersionId,
                startDate: batch.startDate,
                status: 'ACTIVE',
              }
            });

            // Auto-unlock phase 1
            const phases = await tx.curriculumPhase.findMany({
              where: { curriculumVersionId: dto.curriculumVersionId },
              orderBy: { phaseNumber: 'asc' }
            });

            if (phases.length > 0) {
              await tx.studentPhaseProgress.createMany({
                data: phases.map((p, index) => ({
                  enrollmentId: enrollment.id,
                  phaseId: p.id,
                  status: index === 0 ? 'AVAILABLE' : 'LOCKED'
                }))
              });
            }
          }
        }
      }

      return tx.application.update({
        where: { id },
        data: {
          status: dto.status,
          reviewNotes: dto.reviewNotes,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          createdUserId,
        }
      });
    });
  }

  async createStudentAccount(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { interviews: true }
    });

    if (!application) throw new NotFoundException('Application not found');

    const selectedInterview = application.interviews.find(i => i.result === 'SELECTED' && i.status === 'COMPLETED');
    if (!selectedInterview) {
      throw new BadRequestException('Application must have a completed, selected interview');
    }

    if (application.createdUserId) {
      throw new ConflictException('Student account already created for this application');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Check if user already exists
      const existing = await tx.user.findFirst({
        where: { email: application.email }
      });
      if (existing) {
        throw new ConflictException('User with this email already exists');
      }

      // 2. Generate Student ID
      const year = new Date().getFullYear();
      let studentId = '';
      let isUnique = false;
      while (!isUnique) {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        studentId = `INFY-${year}-${randomDigits}`;
        const existingId = await tx.user.findUnique({ where: { studentId } });
        if (!existingId) isUnique = true;
      }

      // 3. Generate Temporary Password
      const tempPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      // 4. Create User
      const newUser = await tx.user.create({
        data: {
          studentId,
          name: application.name,
          email: application.email,
          passwordHash,
          role: 'STUDENT',
          isActive: true,
          phone: application.phone,
          college: application.college,
          degree: application.degree,
          graduationYear: application.graduationYear,
          domainId: application.domainId,
          specializationId: application.specializationId,
        }
      });

      // Assign course based on domainId (use contains match for flexibility)
      if (application.domainId) {
        const course = await tx.course.findFirst({
          where: {
            OR: [
              { name: { equals: application.domainId, mode: 'insensitive' } },
              { name: { contains: application.domainId, mode: 'insensitive' } },
            ]
          }
        });
        if (course) {
          await tx.studentCourse.create({
            data: {
              studentId: newUser.id,
              courseId: course.id
            }
          });
        }
      }

      // 5. Link Application
      await tx.application.update({
        where: { id: application.id },
        data: { createdUserId: newUser.id }
      });

      // Return credentials (password returned ONLY ONCE here)
      return {
        id: newUser.id,
        studentId,
        name: newUser.name,
        email: newUser.email,
        tempPassword,
        domainId: newUser.domainId,
        specializationId: newUser.specializationId
      };
    });
  }
}
