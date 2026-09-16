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
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DomainsService = class DomainsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createDomainDto) {
        return this.prisma.domain.create({
            data: createDomainDto,
        });
    }
    findAll() {
        return this.prisma.domain.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { specializations: true, curricula: true },
                },
            },
        });
    }
    async findOne(id) {
        const domain = await this.prisma.domain.findUnique({
            where: { id },
            include: { specializations: true },
        });
        if (!domain) {
            throw new common_1.NotFoundException(`Domain #${id} not found`);
        }
        return domain;
    }
    update(id, updateDomainDto) {
        return this.prisma.domain.update({
            where: { id },
            data: updateDomainDto,
        });
    }
    remove(id) {
        return this.prisma.domain.delete({
            where: { id },
        });
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DomainsService);
//# sourceMappingURL=domains.service.js.map