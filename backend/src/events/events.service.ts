import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private async pruneCompletedEvents() {
    try {
      const now = new Date();
      // For any event whose date has passed, remove extra details from DB:
      // only retain title, date, link (where), clearing imageUrl and description
      await this.prisma.event.updateMany({
        where: {
          date: { lt: now },
          OR: [
            { imageUrl: { not: null } },
            { description: { not: '' } },
          ],
        },
        data: {
          imageUrl: null,
          description: '',
        },
      });
    } catch (err) {
      console.warn('Completed events pruning warning:', err);
    }
  }

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async findAll() {
    await this.pruneCompletedEvents();
    return this.prisma.event.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    await this.pruneCompletedEvents();
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findBySlug(slug: string) {
    await this.pruneCompletedEvents();
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });
    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
