import { Module } from '@nestjs/common';
import { StudentCurriculumService } from './student-curriculum.service';
import { StudentCurriculumController } from './student-curriculum.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentCurriculumController],
  providers: [StudentCurriculumService],
  exports: [StudentCurriculumService],
})
export class StudentCurriculumModule {}
