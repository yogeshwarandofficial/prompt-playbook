import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getMyCourses(userId: string) {
    const studentCourses = await this.prisma.studentCourse.findMany({
      where: {
        studentId: userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return studentCourses.map(sc => sc.course);
  }
}
