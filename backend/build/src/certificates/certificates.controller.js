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
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const certificate_dto_1 = require("./dto/certificate.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let CertificatesController = class CertificatesController {
    certificatesService;
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    findEligible() {
        return this.certificatesService.findEligible();
    }
    findAll() {
        return this.certificatesService.findAll();
    }
    findOne(id) {
        return this.certificatesService.findOne(id);
    }
    issue(dto) {
        return this.certificatesService.issue(dto);
    }
    revoke(id, dto) {
        return this.certificatesService.revoke(id, dto);
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Get)('eligible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "findEligible", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('issue'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [certificate_dto_1.IssueCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "issue", null);
__decorate([
    (0, common_1.Patch)(':id/revoke'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, certificate_dto_1.RevokeCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "revoke", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.Controller)('admin/certificates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map