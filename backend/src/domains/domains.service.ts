import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  create(createDomainDto: CreateDomainDto) {
    return this.prisma.domain.create({
      data: createDomainDto,
    });
  }

  findAll() {
    return this.prisma.domain.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { specializations: true, curricula: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
      include: { specializations: true },
    });
    if (!domain) {
      throw new NotFoundException(`Domain #${id} not found`);
    }
    return domain;
  }

  update(id: string, updateDomainDto: UpdateDomainDto) {
    return this.prisma.domain.update({
      where: { id },
      data: updateDomainDto,
    });
  }

  remove(id: string) {
    return this.prisma.domain.delete({
      where: { id },
    });
  }
}
