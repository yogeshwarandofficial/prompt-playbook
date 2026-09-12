import { Controller, Get, Post, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { StudentCurriculumService } from './student-curriculum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('student/curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentCurriculumController {
  constructor(private readonly studentCurriculumService: StudentCurriculumService) {}

  @Get('enrollment')
  getEnrollment(@Req() req: any) {
    return this.studentCurriculumService.getEnrollment(req.user.id);
  }

  @Get('phases/:phaseId')
  getPhaseProgress(@Req() req: any, @Param('phaseId') phaseId: string) {
    return this.studentCurriculumService.getPhaseProgress(req.user.id, phaseId);
  }

  @Post('phases/:progressId/tasks/:taskId/complete')
  completeTask(
    @Req() req: any,
    @Param('progressId') progressId: string,
    @Param('taskId') taskId: string
  ) {
    return this.studentCurriculumService.completeTask(req.user.id, progressId, taskId);
  }

  @Delete('phases/:progressId/tasks/:taskId/complete')
  uncompleteTask(
    @Req() req: any,
    @Param('progressId') progressId: string,
    @Param('taskId') taskId: string
  ) {
    return this.studentCurriculumService.uncompleteTask(req.user.id, progressId, taskId);
  }
}
