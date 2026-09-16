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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let StudentCertificatesController = class StudentCertificatesController {
    certificatesService;
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    getMyCertificate(req) {
        return this.certificatesService.getStudentCertificate(req.user.id);
    }
    async downloadCertificate(req, studentProjectId, res) {
        const buffer = await this.certificatesService.generateDynamicCertificate(studentProjectId, req.user.id);
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename="certificate.png"',
        });
        res.send(buffer);
    }
};
exports.StudentCertificatesController = StudentCertificatesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentCertificatesController.prototype, "getMyCertificate", null);
__decorate([
    (0, common_1.Get)('download/:studentProjectId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('studentProjectId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], StudentCertificatesController.prototype, "downloadCertificate", null);
exports.StudentCertificatesController = StudentCertificatesController = __decorate([
    (0, common_1.Controller)('student/certificate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], StudentCertificatesController);
//# sourceMappingURL=student-certificates.controller.js.map