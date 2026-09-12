import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { ReorderPhasesDto } from './dto/reorder-phases.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.projectsService.getProjects(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.getProject(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, dto);
  }

  @Post(':id/phases')
  addPhase(@Param('id') id: string, @Body() dto: CreatePhaseDto) {
    return this.projectsService.addPhase(id, dto);
  }

  @Patch(':id/phases/reorder')
  reorderPhases(@Param('id') id: string, @Body() dto: ReorderPhasesDto) {
    return this.projectsService.reorderPhases(id, dto);
  }

  @Patch(':id/phases/:phaseId')
  updatePhase(
    @Param('id') id: string,
    @Param('phaseId') phaseId: string,
    @Body() dto: Partial<CreatePhaseDto>,
  ) {
    return this.projectsService.updatePhase(id, phaseId, dto);
  }

  @Delete(':id/phases/:phaseId')
  deletePhase(@Param('id') id: string, @Param('phaseId') phaseId: string) {
    return this.projectsService.deletePhase(id, phaseId);
  }
}
