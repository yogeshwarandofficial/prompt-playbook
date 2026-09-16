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
exports.BatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BatchesService = class BatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createBatchDto) {
        return this.prisma.batch.create({
            data: {
                ...createBatchDto,
                startDate: new Date(createBatchDto.startDate),
            },
        });
    }
    findAll() {
        return this.prisma.batch.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                domain: true,
                specialization: true,
                _count: {
                    select: { enrollments: true },
                },
            },
        });
    }
    async findOne(id) {
        const batch = await this.prisma.batch.findUnique({
            where: { id },
            include: {
                domain: true,
                specialization: true,
                curriculumVersion: true,
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException(`Batch #${id} not found`);
        }
        return batch;
    }
    update(id, updateBatchDto) {
        const data = { ...updateBatchDto };
        if (data.startDate) {
            data.startDate = new Date(data.startDate);
        }
        return this.prisma.batch.update({
            where: { id },
            data,
        });
    }
    remove(id) {
        return this.prisma.batch.delete({
            where: { id },
        });
    }
};
exports.BatchesService = BatchesService;
exports.BatchesService = BatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchesService);
//# sourceMappingURL=batches.service.js.map