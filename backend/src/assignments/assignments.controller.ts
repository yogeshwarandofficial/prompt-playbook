import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post('project-assignments')
  assign(@Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.assignProject(dto);
  }

  @Get('project-assignments')
  getAll() {
    return this.assignmentsService.getAssignments();
  }

  @Get('students/:studentId/internship')
  getStudentInternship(@Param('studentId') studentId: string) {
    return this.assignmentsService.getStudentInternship(studentId);
  }
}
