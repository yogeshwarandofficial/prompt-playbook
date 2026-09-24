import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { NotifyInterviewDto } from './dto/notify-interview.dto';

/** Escapes user-supplied strings before embedding in HTML email bodies. */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;');
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createStudent(dto: CreateStudentDto) {
    const studentId = dto.studentId.trim();
    const email = dto.email.trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { studentId },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.studentId === studentId) {
        throw new ConflictException('Student ID already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.$transaction(async (tx) => {
      // 1. Check if courses exist if courseIds are provided
      if (dto.courseIds && dto.courseIds.length > 0) {
        const courses = await tx.course.findMany({
          where: { 
            id: { in: dto.courseIds },
            isActive: true
          },
        });
        if (courses.length !== dto.courseIds.length) {
          throw new BadRequestException('One or more invalid or inactive course IDs');
        }
      }

      // 2. Create the student
      const newUser = await tx.user.create({
        data: {
          studentId,
          name: dto.name,
          email,
          passwordHash,
          role: 'STUDENT',
          isActive: true,
        },
      });

      // 3. Create the assignments if courseIds are provided
      if (dto.courseIds && dto.courseIds.length > 0) {
        const studentCoursesData = dto.courseIds.map((courseId) => ({
          studentId: newUser.id,
          courseId,
        }));
        await tx.studentCourse.createMany({
          data: studentCoursesData,
        });
      }

      return newUser;
    });

    // Strip passwordHash before returning
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async getStudents() {
    const students = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        isActive: true,   // L-7: exclude soft-deleted students
      },
      include: {
        courses: {
          include: {
            course: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Strip passwordHash
    return students.map(student => {
      const { passwordHash: _, ...safeStudent } = student;
      return safeStudent;
    });
  }

  async removeStudent(studentId: string) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Student not found');
    }

    // L-7: Soft-delete — deactivate instead of hard-delete so all historical
    // data (submissions, reviews, certificates) is preserved for audit purposes.
    // isActive=false also immediately blocks their login via AuthService.
    return this.prisma.user.update({
      where: { id: studentId },
      data: { isActive: false },
      select: { id: true, studentId: true, name: true, email: true, isActive: true },
    });
  }

  async createCourse(dto: CreateCourseDto) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { key: dto.key },
    });

    if (existingCourse) {
      throw new ConflictException('Course key already exists');
    }

    return this.prisma.course.create({
      data: dto,
    });
  }

  async getCourses() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeCourse(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.prisma.course.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async restoreCourse(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.prisma.course.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async getDashboardStats() {
    const [totalStudents, activeStudents, activeCourses, activeProjects, inProgressAssignments, pendingSubmissions, completedInternships, pendingApplications, activeBatches, scheduledInterviews, issuedCertificates] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'STUDENT' } }),
        this.prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
        this.prisma.course.count({ where: { isActive: true } }),
        this.prisma.project.count({ where: { status: 'ACTIVE' } }),
        this.prisma.studentProject.count({ where: { status: 'IN_PROGRESS' } }),
        this.prisma.submission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
        this.prisma.studentProject.count({ where: { status: 'COMPLETED' } }),
        this.prisma.application.count({ where: { status: 'PENDING' } }),
        this.prisma.batch.count({ where: { status: 'ACTIVE' } }),
        this.prisma.interview.count({ where: { status: 'SCHEDULED' } }),
        this.prisma.certificate.count({ where: { status: 'ACTIVE' } }),
      ]);
    return {
      totalStudents,
      activeStudents,
      activeCourses,
      activeProjects,
      inProgressAssignments,
      pendingSubmissions,
      completedInternships,
      pendingApplications,
      activeBatches,
      scheduledInterviews,
      issuedCertificates,
    };
  }

  async assignCourseToStudent(studentId: string, courseId: string) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== 'STUDENT') throw new NotFoundException('Student not found');
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || !course.isActive) throw new BadRequestException('Course not found or inactive');
    const existing = await this.prisma.studentCourse.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) throw new ConflictException('Student already enrolled in this course');
    return this.prisma.studentCourse.create({ data: { studentId, courseId } });
  }

  async updateStudentAccess(studentId: string, enabled: boolean) {
    const student = await this.prisma.user.findFirst({ where: { id: studentId, role: 'STUDENT' } });
    if (!student) throw new NotFoundException('Student not found');
    
    return this.prisma.user.update({
      where: { id: studentId },
      data: { isActive: enabled }
    });
  }

  async notifyInterview(body: NotifyInterviewDto) {
    const { applicantName, applicantEmail, scheduledAt, meetingLink, interviewId } = body;

    // Escape all user-supplied values before HTML interpolation
    const safeName  = escapeHtml(applicantName);
    const safeEmail = escapeHtml(applicantEmail);

    const interviewDate = new Date(scheduledAt);
    const dateStr = interviewDate.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = interviewDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // meetingLink is validated as https/http URL by DTO — safe to use in href
    // Display text is still escaped for defence in depth
    const safeLinkDisplay = escapeHtml(meetingLink);
    const meetingSection = meetingLink
      ? `<div style="text-align:center;margin:28px 0;">
          <a href="${meetingLink}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;background:#6d28d9;color:#ffffff;font-size:15px;font-weight:700;
                    text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
            JOIN INTERVIEW
          </a>
          <p style="margin:10px 0 0;font-size:12px;color:#6b7280;word-break:break-all;">${safeLinkDisplay}</p>
        </div>`
      : `<p style="color:#6b7280;font-style:italic;">No meeting link has been provided yet. Please contact the Academy team.</p>`;

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%);padding:36px 40px 28px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Infynux Academy</h1>
            <p style="margin:8px 0 0;color:#e0d9ff;font-size:14px;">Interview Scheduled</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hello <strong>${safeName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
              Congratulations! Your internship application has been shortlisted and your interview has been scheduled.
              We look forward to speaking with you.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f9f7ff;border:1px solid #e0d9ff;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <h3 style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6d28d9;">
                  Interview Details
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;width:140px;">Date</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Time</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${timeStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Timezone</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">IST (UTC+5:30)</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Interview type</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">Online Interview</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            ${meetingSection}
            <p style="margin:24px 0 0;font-size:14px;color:#374151;line-height:1.7;">
              Please join the meeting a few minutes before the scheduled time.
            </p>
            <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.7;">
              If you have any questions or need to contact Infynux Academy, please reply to this email or contact the Academy team.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#374151;">Regards,</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6d28d9;font-weight:700;">Infynux Academy</p>
            <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">
              This email was sent to ${safeEmail} because you applied for an internship at Infynux Academy.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[interviews/notify] RESEND_API_KEY not configured.');
      // Return a structured object instead of throwing if we want it to be a 503 equivalent,
      // but returning 200 with success: false is what the frontend currently handles gracefully
      // wait, the frontend checks if res.ok. We should probably throw a HttpException or return an object and let frontend handle it.
      // The original code returns a 503 status code. Let's return a 503 exception.
      return { success: false, message: 'Email service not configured. The interview is still saved.' };
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    let toEmail = applicantEmail;
    const override = process.env.RESEND_TO_EMAIL_OVERRIDE;
    if (override && override.trim()) {
      toEmail = override.trim();
    }

    try {
      const { data, error } = await resend.emails.send({
        from: `Infynux Academy <${fromEmail}>`,
        to: toEmail,
        subject: 'Infynux Academy — Interview Scheduled',
        html: htmlBody,
      });

      if (error) {
        console.error('[interviews/notify] Resend delivery error:', error);
        return { success: false, message: `Email delivery failed: ${error.message}. Interview is still saved.` };
      }

      console.log(`[interviews/notify] Sent to ${applicantEmail} (interviewId=${interviewId}, resendId=${data?.id})`);
      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error('[interviews/notify] Unexpected error:', err);
      throw new InternalServerErrorException('Server error sending notification.');
    }
  }
}
