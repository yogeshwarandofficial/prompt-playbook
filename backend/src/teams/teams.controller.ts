import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { BulkCreateTeamTaskDto } from './dto/bulk-create-team-task.dto';
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
  findOneTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findOneTeam(id);
  }

  @Patch(':id')
  updateTeam(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, dto);
  }

  @Delete(':id')
  removeTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.removeTeam(id);
  }

  // ─── Members ──────────────────────────────────────────────────────────────

  @Post(':id/members')
  addMember(
    @Param('id', ParseUUIDPipe) teamId: string,
    @Body() dto: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember(teamId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id', ParseUUIDPipe) teamId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.teamsService.removeMember(teamId, memberId);
  }

  // ─── Tasks ────────────────────────────────────────────────────────────────

  @Post(':id/members/:memberId/tasks')
  createTask(
    @Param('id', ParseUUIDPipe) teamId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() dto: CreateTeamTaskDto,
  ) {
    return this.teamsService.createTask(teamId, memberId, dto);
  }

  /**
   * Bulk assign a task to all or selected members of a team in one call.
   * Handles 50+ students in a day simultaneously.
   */
  @Post(':id/tasks/bulk')
  createBulkTasks(
    @Param('id', ParseUUIDPipe) teamId: string,
    @Body() dto: BulkCreateTeamTaskDto,
  ) {
    return this.teamsService.createBulkTasks(teamId, dto);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTeamTaskDto,
  ) {
    return this.teamsService.updateTask(taskId, dto);
  }

  @Delete('tasks/:taskId')
  removeTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.teamsService.removeTask(taskId);
  }
}

