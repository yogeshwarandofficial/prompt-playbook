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
exports.CurriculumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CurriculumService = class CurriculumService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createCurriculumDto) {
        return this.prisma.curriculum.create({
            data: createCurriculumDto,
        });
    }
    findAll() {
        return this.prisma.curriculum.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                domain: true,
                specialization: true,
                versions: {
                    select: { id: true, version: true, status: true }
                }
            },
        });
    }
    async findOne(id) {
        const curriculum = await this.prisma.curriculum.findUnique({
            where: { id },
            include: {
                domain: true,
                specialization: true,
                versions: {
                    include: {
                        phases: {
                            orderBy: { phaseNumber: 'asc' }
                        }
                    }
                }
            },
        });
        if (!curriculum) {
            throw new common_1.NotFoundException(`Curriculum #${id} not found`);
        }
        return curriculum;
    }
    update(id, updateCurriculumDto) {
        return this.prisma.curriculum.update({
            where: { id },
            data: updateCurriculumDto,
        });
    }
    remove(id) {
        return this.prisma.curriculum.delete({
            where: { id },
        });
    }
    createVersion(dto) {
        return this.prisma.curriculumVersion.create({
            data: dto
        });
    }
    createPhase(versionId, dto) {
        const data = { ...dto, curriculumVersionId: versionId };
        if (data.sheetVisibleFrom) {
            data.sheetVisibleFrom = new Date(data.sheetVisibleFrom);
        }
        return this.prisma.curriculumPhase.create({
            data
        });
    }
    createResource(phaseId, dto) {
        return this.prisma.phaseResource.create({
            data: { ...dto, curriculumPhaseId: phaseId }
        });
    }
    createTask(phaseId, dto) {
        return this.prisma.phaseTask.create({
            data: { ...dto, curriculumPhaseId: phaseId }
        });
    }
};
exports.CurriculumService = CurriculumService;
exports.CurriculumService = CurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CurriculumService);
//# sourceMappingURL=curriculum.service.js.map