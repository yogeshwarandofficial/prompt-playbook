import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        status: 'PENDING',
      },
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
