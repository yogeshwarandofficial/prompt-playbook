"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
const Jimp = require('jimp');
function generateCertNo() {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `INFY-${year}-${rand}`;
}
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateDynamicCertificate(studentProjectId, studentId) {
        const sp = await this.prisma.studentProject.findUnique({
            where: { id: studentProjectId },
            include: {
                student: true,
                project: true
            }
        });
        if (!sp || sp.studentId !== studentId) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (sp.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Project is not yet completed');
        }
        const templatePath = path.join(process.cwd(), 'assets', 'certificate_template.png');
        let image;
        try {
            image = await Jimp.read(templatePath);
        }
        catch (e) {
            throw new common_1.BadRequestException('Certificate template not found on server.');
        }
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        image.print(font, 0, 50, {
            text: sp.student.name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }, 1000, 100);
        return await image.getBuffer(Jimp.MIME_PNG);
    }
    async checkEligibility(studentProjectId) {
        const sp = await this.prisma.studentProject.findUnique({
            where: { id: studentProjectId },
            include: {
                phases: { include: { submissions: { include: { reviews: true } } } },
                student: { select: { id: true, name: true, email: true, studentId: true } },
                project: { select: { id: true, title: true } },
                certificate: true,
            },
        });
        if (!sp)
            throw new common_1.NotFoundException('StudentProject not found');
        if (sp.status !== 'COMPLETED') {
            const incompletePhases = sp.phases.filter((p) => p.status !== 'COMPLETED');
            return {
                eligible: false,
                reason: `Project not completed. Status: ${sp.status}. ${incompletePhases.length} phase(s) still incomplete.`,
                studentProject: sp,
            };
        }
        return { eligible: true, studentProject: sp };
    }
    async findEligible() {
        const completedProjects = await this.prisma.studentProject.findMany({
            where: { status: 'COMPLETED', certificate: null },
            include: {
                student: { select: { id: true, name: true, email: true, studentId: true } },
                project: { select: { id: true, title: true } },
                phases: {
                    select: { status: true },
                },
            },
            orderBy: { completedAt: 'desc' },
        });
        return completedProjects;
    }
    async findAll() {
        return this.prisma.certificate.findMany({
            include: {
                studentProject: {
                    include: {
                        student: { select: { id: true, name: true, email: true, studentId: true } },
                        project: { select: { id: true, title: true } },
                    },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async findOne(id) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id },
            include: {
                studentProject: {
                    include: {
                        student: { select: { id: true, name: true, email: true, studentId: true } },
                        project: { select: { id: true, title: true } },
                    },
                },
            },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        return cert;
    }
    async issue(dto) {
        const { eligible, reason, studentProject } = await this.checkEligibility(dto.studentProjectId);
        if (!eligible)
            throw new common_1.BadRequestException(reason ?? 'Student is not eligible for a certificate');
        if (studentProject.certificate) {
            throw new common_1.ConflictException('A certificate has already been issued for this internship');
        }
        let certNo;
        let attempts = 0;
        do {
            certNo = generateCertNo();
            const dup = await this.prisma.certificate.findUnique({ where: { certificateNo: certNo } });
            if (!dup)
                break;
            attempts++;
        } while (attempts < 5);
        const verificationToken = (0, crypto_1.randomUUID)();
        return this.prisma.certificate.create({
            data: {
                studentId: studentProject.student.id,
                studentProjectId: dto.studentProjectId,
                certificateNo: certNo,
                verificationToken,
                domain: studentProject.project.title,
                specialization: null,
                startDate: studentProject.assignedAt,
                endDate: studentProject.completedAt,
                issuedAt: new Date(),
                status: 'ACTIVE',
            },
        });
    }
    async revoke(id, dto) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        if (cert.status === 'REVOKED')
            throw new common_1.BadRequestException('Certificate is already revoked');
        return this.prisma.certificate.update({
            where: { id },
            data: {
                status: 'REVOKED',
                revokedAt: new Date(),
                revokeReason: dto.reason,
            },
        });
    }
    async getStudentCertificate(studentId) {
        const completedProjects = await this.prisma.studentProject.findMany({
            where: { studentId, status: 'COMPLETED' },
            include: {
                certificate: true,
                project: true,
                student: true,
            },
            orderBy: { completedAt: 'desc' },
        });
        return completedProjects.map((sp) => {
            if (sp.certificate) {
                return {
                    ...sp.certificate,
                    studentProject: sp,
                };
            }
            return {
                id: sp.id,
                studentId: sp.studentId,
                studentProjectId: sp.id,
                certificateNo: `PENDING-${sp.id.substring(0, 6).toUpperCase()}`,
                verificationToken: sp.id,
                status: 'ACTIVE',
                issuedAt: sp.completedAt || new Date(),
                studentProject: sp,
            };
        });
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map