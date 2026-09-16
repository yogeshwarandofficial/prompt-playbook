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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssignmentsService = class AssignmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignProject(dto) {
        const student = await this.prisma.user.findUnique({ where: { id: dto.studentId } });
        if (!student || student.role !== 'STUDENT') {
            throw new common_1.NotFoundException('Student not found');
        }
        const project = await this.prisma.project.findUnique({
            where: { id: dto.projectId },
            include: { phases: { orderBy: { phaseOrder: 'asc' } } },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Only ACTIVE projects can be assigned');
        }
        if (project.phases.length === 0) {
            throw new common_1.BadRequestException('Project must have at least one phase before assigning');
        }
        const existing = await this.prisma.studentProject.findUnique({
            where: { studentId_projectId: { studentId: dto.studentId, projectId: dto.projectId } },
        });
        if (existing && existing.status !== 'CANCELLED') {
            throw new common_1.ConflictException('Student already has an active assignment for this project');
        }
        return this.prisma.$transaction(async (tx) => {
            const assignment = await tx.studentProject.create({
                data: {
                    studentId: dto.studentId,
                    projectId: dto.projectId,
                    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                    status: 'ASSIGNED',
                },
            });
            const phaseData = project.phases.map((phase, index) => ({
                studentProjectId: assignment.id,
                phaseId: phase.id,
                status: index === 0 ? 'AVAILABLE' : 'LOCKED',
            }));
            await tx.studentProjectPhase.createMany({ data: phaseData });
            return tx.studentProject.findUnique({
                where: { id: assignment.id },
                include: {
                    project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } },
                    phases: { include: { phase: true }, orderBy: { phase: { phaseOrder: 'asc' } } },
                    student: { select: { id: true, name: true, studentId: true, email: true } },
                },
            });
        });
    }
    async getAssignments() {
        return this.prisma.studentProject.findMany({
            include: {
                student: { select: { id: true, name: true, studentId: true, email: true } },
                project: { select: { id: true, title: true, status: true } },
            },
            orderBy: { assignedAt: 'desc' },
        });
    }
    async getStudentInternship(studentId) {
        const user = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        const assignments = await this.prisma.studentProject.findMany({
            where: { studentId },
            include: {
                project: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } },
                phases: {
                    include: {
                        phase: { include: { topics: { orderBy: { order: 'asc' } } } },
                        submissions: {
                            include: { reviews: { include: { reviewer: { select: { name: true, role: true } } } } },
                            orderBy: { submittedAt: 'desc' },
                        },
                    },
                    orderBy: { phase: { phaseOrder: 'asc' } },
                },
            },
            orderBy: { assignedAt: 'desc' },
        });
        return {
            student: { id: user.id, name: user.name, studentId: user.studentId, email: user.email },
            assignments,
        };
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map