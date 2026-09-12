import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentCurriculumService {
  constructor(private prisma: PrismaService) {}

  async getEnrollment(studentId: string) {
    const enrollment = await this.prisma.studentCurriculumEnrollment.findFirst({
      where: { studentId },
      include: {
        batch: {
          include: { domain: true, specialization: true }
        },
        curriculumVersion: {
          include: { curriculum: true }
        },
        phaseProgress: {
          include: {
            phase: {
              include: { resources: true, tasks: true }
            },
            studentTasks: true
          },
          orderBy: {
            phase: { phaseNumber: 'asc' }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!enrollment) return null;
    return enrollment;
  }

  async getPhaseProgress(studentId: string, phaseId: string) {
    const progress = await this.prisma.studentPhaseProgress.findFirst({
      where: {
        phaseId,
        enrollment: { studentId }
      },
      include: {
        phase: {
          include: { resources: true, tasks: true }
        },
        studentTasks: true
      }
    });

    if (!progress) throw new NotFoundException('Phase progress not found');
    return progress;
  }

  async completeTask(studentId: string, progressId: string, taskId: string) {
    // Validate ownership
    const progress = await this.prisma.studentPhaseProgress.findFirst({
      where: {
        id: progressId,
        enrollment: { studentId }
      }
    });

    if (!progress) throw new NotFoundException('Progress record not found');

    // Upsert student task
    return this.prisma.studentTask.upsert({
      where: {
        progressId_taskId: { progressId, taskId }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        progressId,
        taskId,
        isCompleted: true,
        completedAt: new Date()
      }
    });
  }

  async uncompleteTask(studentId: string, progressId: string, taskId: string) {
    const progress = await this.prisma.studentPhaseProgress.findFirst({
      where: {
        id: progressId,
        enrollment: { studentId }
      }
    });

    if (!progress) throw new NotFoundException('Progress record not found');

    return this.prisma.studentTask.upsert({
      where: {
        progressId_taskId: { progressId, taskId }
      },
      update: {
        isCompleted: false,
        completedAt: null
      },
      create: {
        progressId,
        taskId,
        isCompleted: false
      }
    });
  }
}
