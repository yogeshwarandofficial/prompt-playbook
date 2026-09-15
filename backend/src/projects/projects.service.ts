import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { ReorderPhasesDto } from './dto/reorder-phases.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ReorderTopicsDto } from './dto/reorder-topics.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(dto: CreateProjectDto) {
    if (dto.courseId) {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new NotFoundException('Course not found');
    }
    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        courseId: dto.courseId ?? null,
        status: dto.status ?? 'DRAFT',
      },
      include: { course: { select: { id: true, name: true } }, phases: { orderBy: { phaseOrder: 'asc' } } },
    });
  }

  async getProjects(status?: string) {
    return this.prisma.project.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        course: { select: { id: true, name: true } },
        _count: { select: { phases: true, assignments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, name: true } },
        phases: { 
          orderBy: { phaseOrder: 'asc' },
          include: { topics: { orderBy: { order: 'asc' } } }
        },
        _count: { select: { assignments: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (dto.courseId) {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new NotFoundException('Course not found');
    }
    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: { course: { select: { id: true, name: true } }, phases: { orderBy: { phaseOrder: 'asc' } } },
    });
  }

  async addPhase(projectId: string, dto: CreatePhaseDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { phases: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    // Auto-assign phaseOrder as max existing + 1 if not provided
    const nextOrder = project.phases.length > 0
      ? Math.max(...project.phases.map(p => p.phaseOrder)) + 1
      : 1;

    return this.prisma.projectPhase.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        instructions: dto.instructions,
        phaseOrder: nextOrder,
      },
    });
  }

  async updatePhase(projectId: string, phaseId: string, dto: Partial<CreatePhaseDto>) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
    if (!phase) throw new NotFoundException('Phase not found');
    return this.prisma.projectPhase.update({ where: { id: phaseId }, data: dto });
  }

  async reorderPhases(projectId: string, dto: ReorderPhasesDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { phases: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    const existingIds = project.phases.map(p => p.id);
    for (const id of dto.phaseIds) {
      if (!existingIds.includes(id)) {
        throw new BadRequestException(`Phase ${id} does not belong to this project`);
      }
    }
    if (dto.phaseIds.length !== existingIds.length) {
      throw new BadRequestException('All phase IDs must be provided for reordering');
    }

    // Update phaseOrder for each phase in a transaction
    return this.prisma.$transaction(
      dto.phaseIds.map((phaseId, index) =>
        this.prisma.projectPhase.update({
          where: { id: phaseId },
          data: { phaseOrder: index + 1 },
        }),
      ),
    );
  }

  async deletePhase(projectId: string, phaseId: string) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
    if (!phase) throw new NotFoundException('Phase not found');
    return this.prisma.projectPhase.delete({ where: { id: phaseId } });
  }

  async addTopic(projectId: string, phaseId: string, dto: CreateTopicDto) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId }, include: { topics: true } });
    if (!phase) throw new NotFoundException('Phase not found');

    const nextOrder = phase.topics.length > 0
      ? Math.max(...phase.topics.map(t => t.order)) + 1
      : 1;

    return this.prisma.projectPhaseTopic.create({
      data: {
        projectPhaseId: phaseId,
        title: dto.title,
        description: dto.description,
        blogUrl: dto.blogUrl,
        order: dto.order ?? nextOrder,
      },
    });
  }

  async updateTopic(projectId: string, phaseId: string, topicId: string, dto: UpdateTopicDto) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
    if (!phase) throw new NotFoundException('Phase not found');
    
    const topic = await this.prisma.projectPhaseTopic.findFirst({ where: { id: topicId, projectPhaseId: phaseId } });
    if (!topic) throw new NotFoundException('Topic not found');

    return this.prisma.projectPhaseTopic.update({ where: { id: topicId }, data: dto });
  }

  async reorderTopics(projectId: string, phaseId: string, dto: ReorderTopicsDto) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId }, include: { topics: true } });
    if (!phase) throw new NotFoundException('Phase not found');

    const existingIds = phase.topics.map(t => t.id);
    for (const id of dto.topicIds) {
      if (!existingIds.includes(id)) {
        throw new BadRequestException(`Topic ${id} does not belong to this phase`);
      }
    }
    if (dto.topicIds.length !== existingIds.length) {
      throw new BadRequestException('All topic IDs must be provided for reordering');
    }

    return this.prisma.$transaction(
      dto.topicIds.map((topicId, index) =>
        this.prisma.projectPhaseTopic.update({
          where: { id: topicId },
          data: { order: index + 1 },
        }),
      ),
    );
  }

  async deleteTopic(projectId: string, phaseId: string, topicId: string) {
    const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
    if (!phase) throw new NotFoundException('Phase not found');
    
    const topic = await this.prisma.projectPhaseTopic.findFirst({ where: { id: topicId, projectPhaseId: phaseId } });
    if (!topic) throw new NotFoundException('Topic not found');

    return this.prisma.projectPhaseTopic.delete({ where: { id: topicId } });
  }
}
