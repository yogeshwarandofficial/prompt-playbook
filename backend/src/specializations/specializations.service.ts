import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(private prisma: PrismaService) {}

  create(createSpecializationDto: CreateSpecializationDto) {
    return this.prisma.specialization.create({
      data: createSpecializationDto,
    });
  }

  findAll() {
    return this.prisma.specialization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        domain: true,
        _count: {
          select: { batches: true, curricula: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
      include: { domain: true },
    });
    if (!specialization) {
      throw new NotFoundException(`Specialization #${id} not found`);
    }
    return specialization;
  }

  update(id: string, updateSpecializationDto: UpdateSpecializationDto) {
    return this.prisma.specialization.update({
      where: { id },
      data: updateSpecializationDto,
    });
  }

  remove(id: string) {
    return this.prisma.specialization.delete({
      where: { id },
    });
  }
}
