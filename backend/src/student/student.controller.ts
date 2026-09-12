import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('courses')
  getMyCourses(@Req() req: any) {
    // JWT guard populates req.user
    const userId = req.user.id;
    return this.studentService.getMyCourses(userId);
  }
}
