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
exports.StudentCurriculumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentCurriculumService = class StudentCurriculumService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEnrollment(studentId) {
        const enrollment = await this.prisma.studentCurriculumEnrollment.findFirst({
            where: { studentId },
            include: {
                batch: {
                    include: { domain: true, specialization: true }
                },
                curriculumVersion: {
                    include: { curriculum: true }
                },
                phaseProgress: {
                    include: {
                        phase: {
                            include: { resources: true, tasks: true }
                        },
                        studentTasks: true
                    },
                    orderBy: {
                        phase: { phaseNumber: 'asc' }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        if (!enrollment)
            return null;
        return enrollment;
    }
    async getPhaseProgress(studentId, phaseId) {
        const progress = await this.prisma.studentPhaseProgress.findFirst({
            where: {
                phaseId,
                enrollment: { studentId }
            },
            include: {
                phase: {
                    include: { resources: true, tasks: true }
                },
                studentTasks: true
            }
        });
        if (!progress)
            throw new common_1.NotFoundException('Phase progress not found');
        return progress;
    }
    async completeTask(studentId, progressId, taskId) {
        const progress = await this.prisma.studentPhaseProgress.findFirst({
            where: {
                id: progressId,
                enrollment: { studentId }
            }
        });
        if (!progress)
            throw new common_1.NotFoundException('Progress record not found');
        return this.prisma.studentTask.upsert({
            where: {
                progressId_taskId: { progressId, taskId }
            },
            update: {
                isCompleted: true,
                completedAt: new Date()
            },
            create: {
                progressId,
                taskId,
                isCompleted: true,
                completedAt: new Date()
            }
        });
    }
    async uncompleteTask(studentId, progressId, taskId) {
        const progress = await this.prisma.studentPhaseProgress.findFirst({
            where: {
                id: progressId,
                enrollment: { studentId }
            }
        });
        if (!progress)
            throw new common_1.NotFoundException('Progress record not found');
        return this.prisma.studentTask.upsert({
            where: {
                progressId_taskId: { progressId, taskId }
            },
            update: {
                isCompleted: false,
                completedAt: null
            },
            create: {
                progressId,
                taskId,
                isCompleted: false
            }
        });
    }
};
exports.StudentCurriculumService = StudentCurriculumService;
exports.StudentCurriculumService = StudentCurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentCurriculumService);
//# sourceMappingURL=student-curriculum.service.js.map