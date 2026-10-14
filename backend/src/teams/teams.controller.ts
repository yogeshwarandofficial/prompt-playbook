import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { UpdateTeamTaskDto } from './dto/update-team-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/teams')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ─── Teams ────────────────────────────────────────────────────────────────

  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  @Get()
  findAllTeams() {
    return this.teamsService.findAllTeams();
  }

  @Get('students')
  getAllStudents() {
    return this.teamsService.getAllStudents();
  }

  @Get(':id')
  findOneTeam(@Param('id') id: string) {
    return this.teamsService.findOneTeam(id);
  }

  @Patch(':id')
  updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, dto);
  }

  @Delete(':id')
  removeTeam(@Param('id') id: string) {
    return this.teamsService.removeTeam(id);
  }

  // ─── Members ──────────────────────────────────────────────────────────────

  @Post(':id/members')
  addMember(@Param('id') teamId: string, @Body() dto: AddTeamMemberDto) {
    return this.teamsService.addMember(teamId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamsService.removeMember(teamId, memberId);
  }

  // ─── Tasks ────────────────────────────────────────────────────────────────

  @Post(':id/members/:memberId/tasks')
  createTask(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
    @Body() dto: CreateTeamTaskDto,
  ) {
    return this.teamsService.createTask(teamId, memberId, dto);
  }

  @Patch('tasks/:taskId')
  updateTask(@Param('taskId') taskId: string, @Body() dto: UpdateTeamTaskDto) {
    return this.teamsService.updateTask(taskId, dto);
  }

  @Delete('tasks/:taskId')
  removeTask(@Param('taskId') taskId: string) {
    return this.teamsService.removeTask(taskId);
  }
}
