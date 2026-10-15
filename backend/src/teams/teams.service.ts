import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { BulkCreateTeamTaskDto } from './dto/bulk-create-team-task.dto';
import { UpdateTeamTaskDto } from './dto/update-team-task.dto';
import { SubmitTeamTaskDto } from './dto/submit-team-task.dto';
import { TeamTaskStatus } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  // ─── Teams ───────────────────────────────────────────────────────────────

  async createTeam(dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
      },
      include: { members: { include: { student: true, tasks: true } } },
    });
  }

  async findAllTeams() {
    return this.prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                studentId: true,
                domainId: true,
              },
            },
            tasks: { orderBy: { createdAt: 'desc' } },
          },
        },
        _count: { select: { members: true } },
      },
    });
  }

  async findOneTeam(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                studentId: true,
              },
            },
            tasks: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });
    if (!team) throw new NotFoundException(`Team #${id} not found`);
    return team;
  }

  async updateTeam(id: string, dto: UpdateTeamDto) {
    await this.findOneTeam(id);
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.team.update({ where: { id }, data });
  }

  async removeTeam(id: string) {
    await this.findOneTeam(id);
    return this.prisma.team.delete({ where: { id } });
  }

  // ─── Members ─────────────────────────────────────────────────────────────

  async addMember(teamId: string, dto: AddTeamMemberDto) {
    await this.findOneTeam(teamId);

    // Check student exists
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);

    // Check not already a member
    const existing = await this.prisma.teamMember.findUnique({
      where: { teamId_studentId: { teamId, studentId: dto.studentId } },
    });
    if (existing) throw new ConflictException('Student is already a member of this team');

    return this.prisma.teamMember.create({
      data: { teamId, studentId: dto.studentId },
      include: { student: { select: { id: true, name: true, email: true, studentId: true } } },
    });
  }

  async removeMember(teamId: string, memberId: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id: memberId, teamId },
    });
    if (!member) throw new NotFoundException(`Member #${memberId} not found in team`);
    return this.prisma.teamMember.delete({ where: { id: memberId } });
  }

  // ─── Tasks ────────────────────────────────────────────────────────────────

  async createTask(teamId: string, memberId: string, dto: CreateTeamTaskDto) {
    // Verify member belongs to team
    const member = await this.prisma.teamMember.findFirst({
      where: { id: memberId, teamId },
    });
    if (!member) throw new NotFoundException(`Member #${memberId} not found in team`);

    return this.prisma.teamTask.create({
      data: {
        teamMemberId: memberId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        status: dto.status || TeamTaskStatus.PENDING,
        taskUrl: dto.taskUrl?.trim() || null,
      },
    });
  }

  /**
   * Bulk assign task to multiple or all students in a team in a single database transaction.
   * Efficiently handles 50+ students simultaneously with O(1) query complexity.
   */
  async createBulkTasks(teamId: string, dto: BulkCreateTeamTaskDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });
    if (!team) throw new NotFoundException(`Team #${teamId} not found`);

    if (!team.members || team.members.length === 0) {
      throw new BadRequestException('Cannot assign tasks: this team currently has no student members.');
    }

    let targetMembers = team.members;
    if (dto.memberIds && dto.memberIds.length > 0) {
      const allowedIds = new Set(dto.memberIds);
      targetMembers = team.members.filter((m) => allowedIds.has(m.id));
      if (targetMembers.length === 0) {
        throw new BadRequestException('None of the specified member IDs belong to this team.');
      }
    }

    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    const cleanTitle = dto.title.trim();
    const cleanDesc = dto.description?.trim() || null;
    const cleanUrl = dto.taskUrl?.trim() || null;
    const taskStatus = dto.status || TeamTaskStatus.PENDING;

    const tasksData = targetMembers.map((member) => ({
      teamMemberId: member.id,
      title: cleanTitle,
      description: cleanDesc,
      dueDate,
      status: taskStatus,
      taskUrl: cleanUrl,
    }));

    // Atomically insert all tasks in a single multi-row INSERT
    await this.prisma.teamTask.createMany({
      data: tasksData,
    });

    return {
      success: true,
      assignedCount: targetMembers.length,
      message: `Task successfully assigned to ${targetMembers.length} student${
        targetMembers.length > 1 ? 's' : ''
      }.`,
    };
  }

  async updateTask(taskId: string, dto: UpdateTeamTaskDto) {
    const task = await this.prisma.teamTask.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task #${taskId} not found`);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.taskUrl !== undefined) data.taskUrl = dto.taskUrl?.trim() || null;
    if (dto.submissionContent !== undefined)
      data.submissionContent = dto.submissionContent?.trim() || null;
    if (dto.submissionUrl !== undefined)
      data.submissionUrl = dto.submissionUrl?.trim() || null;

    return this.prisma.teamTask.update({ where: { id: taskId }, data });
  }

  async removeTask(taskId: string) {
    const task = await this.prisma.teamTask.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task #${taskId} not found`);
    return this.prisma.teamTask.delete({ where: { id: taskId } });
  }

  // ─── Students helper ─────────────────────────────────────────────────────

  async getAllStudents() {
    return this.prisma.user.findMany({
      where: { role: 'STUDENT', isActive: true },
      select: { id: true, name: true, email: true, studentId: true },
      orderBy: { name: 'asc' },
    });
  }

  // ─── Student Team Operations ─────────────────────────────────────────────

  async getStudentTeams(userId: string) {
    const teams = await this.prisma.team.findMany({
      where: {
        members: {
          some: {
            studentId: userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                studentId: true,
              },
            },
            tasks: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    return teams.map((team) => {
      const totalTasks = team.members.reduce((acc, m) => acc + m.tasks.length, 0);
      const completedTasks = team.members.reduce(
        (acc, m) => acc + m.tasks.filter((t) => t.status === 'COMPLETED').length,
        0,
      );
      const inProgressTasks = team.members.reduce(
        (acc, m) => acc + m.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        0,
      );
      const pendingTasks = team.members.reduce(
        (acc, m) => acc + m.tasks.filter((t) => t.status === 'PENDING').length,
        0,
      );
      const myMember = team.members.find((m) => m.studentId === userId);

      return {
        ...team,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        myMemberId: myMember?.id,
        myTasks: myMember?.tasks || [],
      };
    });
  }

  async studentCreateTeam(userId: string, dto?: any) {
    throw new ForbiddenException('Students cannot create teams. Teams are managed by administrators.');
  }

  async studentUpdateTaskStatus(userId: string, taskId: string, status: TeamTaskStatus) {
    // Prevent students from directly marking task as COMPLETED or CANCELLED
    if (status === TeamTaskStatus.COMPLETED) {
      throw new ForbiddenException(
        'To complete a task, please submit your deliverables through the submission form.',
      );
    }
    if (status === TeamTaskStatus.CANCELLED) {
      throw new ForbiddenException('Students cannot cancel tasks. Contact your administrator.');
    }

    const task = await this.prisma.teamTask.findUnique({
      where: { id: taskId },
      include: {
        teamMember: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task #${taskId} not found`);
    }

    if (task.teamMember.studentId !== userId) {
      throw new ForbiddenException('You can only update tasks assigned to you');
    }

    if (task.status === TeamTaskStatus.COMPLETED) {
      throw new ForbiddenException('Submitted tasks are finalized and cannot be reopened by students');
    }

    return this.prisma.teamTask.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async studentSubmitTask(userId: string, taskId: string, dto: SubmitTeamTaskDto) {
    const cleanContent = dto.content?.trim();
    const cleanUrl = dto.submissionUrl?.trim();

    if (!cleanContent && !cleanUrl) {
      throw new BadRequestException(
        'Please provide a repository/PR URL or a description of your completed work.',
      );
    }

    const task = await this.prisma.teamTask.findUnique({
      where: { id: taskId },
      include: {
        teamMember: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task #${taskId} not found`);
    }

    if (task.teamMember.studentId !== userId) {
      throw new ForbiddenException('You can only submit tasks assigned to you');
    }

    if (task.status === TeamTaskStatus.COMPLETED) {
      throw new ForbiddenException('This task has already been submitted and finalized');
    }

    return this.prisma.teamTask.update({
      where: { id: taskId },
      data: {
        status: TeamTaskStatus.COMPLETED,
        submissionContent: cleanContent || null,
        submissionUrl: cleanUrl || null,
        submittedAt: new Date(),
      },
    });
  }

  async studentCreateTask(
    userId: string,
    teamId: string,
    memberId: string,
    dto: CreateTeamTaskDto,
  ) {
    throw new ForbiddenException('Students cannot assign tasks. Tasks are assigned by administrators.');
  }
}


