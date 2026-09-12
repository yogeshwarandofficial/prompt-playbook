import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCourseDto } from './dto/create-course.dto';

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
        role: 'STUDENT'
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
}
