import { Controller, Post, Get, Body, UseGuards, Delete, Patch, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('students')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.adminService.createStudent(createStudentDto);
  }

  @Get('students')
  getStudents() {
    return this.adminService.getStudents();
  }

  @Delete('students/:id')
  removeStudent(@Param('id') id: string) {
    return this.adminService.removeStudent(id);
  }

  @Post('courses')
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.adminService.createCourse(createCourseDto);
  }

  @Get('courses')
  getCourses() {
    return this.adminService.getCourses();
  }

  @Delete('courses/:id')
  removeCourse(@Param('id') id: string) {
    return this.adminService.removeCourse(id);
  }

  @Patch('courses/:id/restore')
  restoreCourse(@Param('id') id: string) {
    return this.adminService.restoreCourse(id);
  }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Post('students/:studentId/courses')
  assignCourse(
    @Param('studentId') studentId: string,
    @Body() assignCourseDto: AssignCourseDto,
  ) {
    return this.adminService.assignCourseToStudent(studentId, assignCourseDto.courseId);
  }

  @Patch('students/:studentId/access')
  updateStudentAccess(
    @Param('studentId') studentId: string,
    @Body() updateAccessDto: UpdateAccessDto,
  ) {
    return this.adminService.updateStudentAccess(studentId, updateAccessDto.enabled);
  }

  @Post('interviews/notify')
  notifyInterview(@Body() body: any) {
    return this.adminService.notifyInterview(body);
  }

}
