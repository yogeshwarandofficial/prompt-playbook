import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { CreateCurriculumVersionDto } from './dto/create-version.dto';
import { CreateCurriculumPhaseDto } from './dto/create-phase.dto';
import { CreateCurriculumResourceDto } from './dto/create-resource.dto';
import { CreateCurriculumTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  findAll() {
    return this.curriculumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurriculumDto: UpdateCurriculumDto) {
    return this.curriculumService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curriculumService.remove(id);
  }
  
  @Post('versions')
  createVersion(@Body() dto: CreateCurriculumVersionDto) {
    return this.curriculumService.createVersion(dto);
  }
  
  @Post('versions/:versionId/phases')
  createPhase(@Param('versionId') versionId: string, @Body() dto: CreateCurriculumPhaseDto) {
    return this.curriculumService.createPhase(versionId, dto);
  }

  @Post('phases/:phaseId/resources')
  createResource(@Param('phaseId') phaseId: string, @Body() dto: CreateCurriculumResourceDto) {
    return this.curriculumService.createResource(phaseId, dto);
  }

  @Post('phases/:phaseId/tasks')
  createTask(@Param('phaseId') phaseId: string, @Body() dto: CreateCurriculumTaskDto) {
    return this.curriculumService.createTask(phaseId, dto);
  }
}
