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
exports.SpecializationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SpecializationsService = class SpecializationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createSpecializationDto) {
        return this.prisma.specialization.create({
            data: createSpecializationDto,
        });
    }
    findAll() {
        return this.prisma.specialization.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                domain: true,
                _count: {
                    select: { batches: true, curricula: true },
                },
            },
        });
    }
    async findOne(id) {
        const specialization = await this.prisma.specialization.findUnique({
            where: { id },
            include: { domain: true },
        });
        if (!specialization) {
            throw new common_1.NotFoundException(`Specialization #${id} not found`);
        }
        return specialization;
    }
    update(id, updateSpecializationDto) {
        return this.prisma.specialization.update({
            where: { id },
            data: updateSpecializationDto,
        });
    }
    remove(id) {
        return this.prisma.specialization.delete({
            where: { id },
        });
    }
};
exports.SpecializationsService = SpecializationsService;
exports.SpecializationsService = SpecializationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecializationsService);
//# sourceMappingURL=specializations.service.js.map