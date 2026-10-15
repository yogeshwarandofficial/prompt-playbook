import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { StudentCreateTeamDto } from './dto/student-create-team.dto';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SubmitTeamTaskDto } from './dto/submit-team-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('student/teams')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
export class StudentTeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getMyTeams(@Req() req: any) {
    return this.teamsService.getStudentTeams(req.user.id);
  }

  @Post()
  createTeam(@Req() req: any, @Body() dto: StudentCreateTeamDto) {
    return this.teamsService.studentCreateTeam(req.user.id, dto);
  }

  @Patch('tasks/:taskId/status')
  updateTaskStatus(
    @Req() req: any,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.teamsService.studentUpdateTaskStatus(req.user.id, taskId, dto.status);
  }

  @Post('tasks/:taskId/submit')
  submitTask(
    @Req() req: any,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: SubmitTeamTaskDto,
  ) {
    return this.teamsService.studentSubmitTask(req.user.id, taskId, dto);
  }

  @Post(':id/members/:memberId/tasks')
  createTask(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) teamId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() dto: CreateTeamTaskDto,
  ) {
    return this.teamsService.studentCreateTask(req.user.id, teamId, memberId, dto);
  }
}

