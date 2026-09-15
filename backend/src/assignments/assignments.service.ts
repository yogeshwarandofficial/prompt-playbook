import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assignProject(dto: CreateAssignmentDto) {
    // Validate student
    const student = await this.prisma.user.findUnique({ where: { id: dto.studentId } });
    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Student not found');
    }

    // Validate project
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: { phases: { orderBy: { phaseOrder: 'asc' } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== 'ACTIVE') {
      throw new BadRequestException('Only ACTIVE projects can be assigned');
    }
    if (project.phases.length === 0) {
      throw new BadRequestException('Project must have at least one phase before assigning');
    }

    // Prevent duplicate assignment
    const existing = await this.prisma.studentProject.findUnique({
      where: { studentId_projectId: { studentId: dto.studentId, projectId: dto.projectId } },
    });
    if (existing && existing.status !== 'CANCELLED') {
      throw new ConflictException('Student already has an active assignment for this project');
    }

    // Create assignment + phase states in a single transaction
    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.studentProject.create({
        data: {
          studentId: dto.studentId,
          projectId: dto.projectId,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          status: 'ASSIGNED',
        },
      });

      // Phase 1 = AVAILABLE, rest = LOCKED
      const phaseData = project.phases.map((phase, index) => ({
        studentProjectId: assignment.id,
        phaseId: phase.id,
        status: index === 0 ? ('AVAILABLE' as const) : ('LOCKED' as const),
      }));

      await tx.studentProjectPhase.createMany({ data: phaseData });

      return tx.studentProject.findUnique({
        where: { id: assignment.id },
        include: {
          project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } },
          phases: { include: { phase: true }, orderBy: { phase: { phaseOrder: 'asc' } } },
          student: { select: { id: true, name: true, studentId: true, email: true } },
        },
      });
    });
  }

  async getAssignments() {
    return this.prisma.studentProject.findMany({
      include: {
        student: { select: { id: true, name: true, studentId: true, email: true } },
        project: { select: { id: true, title: true, status: true } },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async getStudentInternship(studentId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!user) throw new NotFoundException('Student not found');

    const assignments = await this.prisma.studentProject.findMany({
      where: { studentId },
      include: {
        project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } },
        phases: {
          include: {
            phase: { include: { topics: { orderBy: { order: 'asc' } } } },
            submissions: {
              include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
              orderBy: { submittedAt: 'desc' },
            },
          },
          orderBy: { phase: { phaseOrder: 'asc' } },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return {
      student: { id: user.id, name: user.name, studentId: user.studentId, email: user.email },
      assignments,
    };
  }
}
