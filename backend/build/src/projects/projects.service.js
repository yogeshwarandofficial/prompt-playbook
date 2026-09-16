"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProject(dto) {
        if (dto.courseId) {
            const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
        }
        return this.prisma.project.create({
            data: {
                title: dto.title,
                description: dto.description,
                courseId: dto.courseId ?? null,
                status: dto.status ?? 'DRAFT',
            },
            include: { course: { select: { id: true, name: true } }, phases: { orderBy: { phaseOrder: 'asc' } } },
        });
    }
    async getProjects(status) {
        return this.prisma.project.findMany({
            where: status ? { status: status } : undefined,
            include: {
                course: { select: { id: true, name: true } },
                _count: { select: { phases: true, assignments: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getProject(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                course: { select: { id: true, name: true } },
                phases: {
                    orderBy: { phaseOrder: 'asc' },
                    include: { topics: { orderBy: { order: 'asc' } } }
                },
                _count: { select: { assignments: true } },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async updateProject(id, dto) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (dto.courseId) {
            const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
        }
        return this.prisma.project.update({
            where: { id },
            data: dto,
            include: { course: { select: { id: true, name: true } }, phases: { orderBy: { phaseOrder: 'asc' } } },
        });
    }
    async addPhase(projectId, dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { phases: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const nextOrder = project.phases.length > 0
            ? Math.max(...project.phases.map(p => p.phaseOrder)) + 1
            : 1;
        return this.prisma.projectPhase.create({
            data: {
                projectId,
                title: dto.title,
                description: dto.description,
                instructions: dto.instructions,
                phaseOrder: nextOrder,
            },
        });
    }
    async updatePhase(projectId, phaseId, dto) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        return this.prisma.projectPhase.update({ where: { id: phaseId }, data: dto });
    }
    async reorderPhases(projectId, dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { phases: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const existingIds = project.phases.map(p => p.id);
        for (const id of dto.phaseIds) {
            if (!existingIds.includes(id)) {
                throw new common_1.BadRequestException(`Phase ${id} does not belong to this project`);
            }
        }
        if (dto.phaseIds.length !== existingIds.length) {
            throw new common_1.BadRequestException('All phase IDs must be provided for reordering');
        }
        return this.prisma.$transaction(dto.phaseIds.map((phaseId, index) => this.prisma.projectPhase.update({
            where: { id: phaseId },
            data: { phaseOrder: index + 1 },
        })));
    }
    async deletePhase(projectId, phaseId) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        return this.prisma.projectPhase.delete({ where: { id: phaseId } });
    }
    async addTopic(projectId, phaseId, dto) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId }, include: { topics: true } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        const nextOrder = phase.topics.length > 0
            ? Math.max(...phase.topics.map(t => t.order)) + 1
            : 1;
        return this.prisma.projectPhaseTopic.create({
            data: {
                projectPhaseId: phaseId,
                title: dto.title,
                description: dto.description,
                blogUrl: dto.blogUrl,
                order: dto.order ?? nextOrder,
            },
        });
    }
    async updateTopic(projectId, phaseId, topicId, dto) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        const topic = await this.prisma.projectPhaseTopic.findFirst({ where: { id: topicId, projectPhaseId: phaseId } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        return this.prisma.projectPhaseTopic.update({ where: { id: topicId }, data: dto });
    }
    async reorderTopics(projectId, phaseId, dto) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId }, include: { topics: true } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        const existingIds = phase.topics.map(t => t.id);
        for (const id of dto.topicIds) {
            if (!existingIds.includes(id)) {
                throw new common_1.BadRequestException(`Topic ${id} does not belong to this phase`);
            }
        }
        if (dto.topicIds.length !== existingIds.length) {
            throw new common_1.BadRequestException('All topic IDs must be provided for reordering');
        }
        return this.prisma.$transaction(dto.topicIds.map((topicId, index) => this.prisma.projectPhaseTopic.update({
            where: { id: topicId },
            data: { order: index + 1 },
        })));
    }
    async deleteTopic(projectId, phaseId, topicId) {
        const phase = await this.prisma.projectPhase.findFirst({ where: { id: phaseId, projectId } });
        if (!phase)
            throw new common_1.NotFoundException('Phase not found');
        const topic = await this.prisma.projectPhaseTopic.findFirst({ where: { id: topicId, projectPhaseId: phaseId } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        return this.prisma.projectPhaseTopic.delete({ where: { id: topicId } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map