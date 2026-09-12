import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  create(createBatchDto: CreateBatchDto) {
    return this.prisma.batch.create({
      data: {
        ...createBatchDto,
        startDate: new Date(createBatchDto.startDate),
      },
    });
  }

  findAll() {
    return this.prisma.batch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        domain: true,
        specialization: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        domain: true,
        specialization: true,
        curriculumVersion: true,
      },
    });
    if (!batch) {
      throw new NotFoundException(`Batch #${id} not found`);
    }
    return batch;
  }

  update(id: string, updateBatchDto: UpdateBatchDto) {
    const data: any = { ...updateBatchDto };
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
    }
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.batch.delete({
      where: { id },
    });
  }
}
