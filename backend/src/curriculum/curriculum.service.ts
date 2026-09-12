import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { CreateCurriculumVersionDto } from './dto/create-version.dto';
import { CreateCurriculumPhaseDto } from './dto/create-phase.dto';
import { CreateCurriculumResourceDto } from './dto/create-resource.dto';
import { CreateCurriculumTaskDto } from './dto/create-task.dto';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  create(createCurriculumDto: CreateCurriculumDto) {
    return this.prisma.curriculum.create({
      data: createCurriculumDto,
    });
  }

  findAll() {
    return this.prisma.curriculum.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        domain: true,
        specialization: true,
        versions: {
          select: { id: true, version: true, status: true }
        }
      },
    });
  }

  async findOne(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        domain: true,
        specialization: true,
        versions: {
          include: {
            phases: {
              orderBy: { phaseNumber: 'asc' }
            }
          }
        }
      },
    });
    if (!curriculum) {
      throw new NotFoundException(`Curriculum #${id} not found`);
    }
    return curriculum;
  }

  update(id: string, updateCurriculumDto: UpdateCurriculumDto) {
    return this.prisma.curriculum.update({
      where: { id },
      data: updateCurriculumDto,
    });
  }

  remove(id: string) {
    return this.prisma.curriculum.delete({
      where: { id },
    });
  }
  
  createVersion(dto: CreateCurriculumVersionDto) {
    return this.prisma.curriculumVersion.create({
      data: dto
    });
  }
  
  createPhase(versionId: string, dto: CreateCurriculumPhaseDto) {
    const data: any = { ...dto, curriculumVersionId: versionId };
    if (data.sheetVisibleFrom) {
      data.sheetVisibleFrom = new Date(data.sheetVisibleFrom);
    }
    return this.prisma.curriculumPhase.create({
      data
    });
  }

  createResource(phaseId: string, dto: CreateCurriculumResourceDto) {
    return this.prisma.phaseResource.create({
      data: { ...dto, curriculumPhaseId: phaseId }
    });
  }

  createTask(phaseId: string, dto: CreateCurriculumTaskDto) {
    return this.prisma.phaseTask.create({
      data: { ...dto, curriculumPhaseId: phaseId }
    });
  }
}
