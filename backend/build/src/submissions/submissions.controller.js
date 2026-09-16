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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const create_submission_dto_1 = require("./dto/create-submission.dto");
const create_review_dto_1 = require("./dto/create-review.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let SubmissionsController = class SubmissionsController {
    submissionsService;
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    submitPhase(req, phaseId, dto) {
        return this.submissionsService.submitPhase(req.user.id, phaseId, dto);
    }
    getPhaseSubmissions(req, phaseId) {
        return this.submissionsService.getPhaseSubmissions(req.user.id, phaseId);
    }
    getMyProjects(req) {
        return this.submissionsService.getMyProjects(req.user.id);
    }
    getAdminSubmissions(status) {
        return this.submissionsService.getAdminSubmissions(status);
    }
    getSubmission(id) {
        return this.submissionsService.getSubmission(id);
    }
    review(req, id, dto) {
        return this.submissionsService.reviewSubmission(req.user.id, id, dto);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Post)('student/phases/:phaseId/submit'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_submission_dto_1.CreateSubmissionDto]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "submitPhase", null);
__decorate([
    (0, common_1.Get)('student/phases/:phaseId/submissions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('phaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getPhaseSubmissions", null);
__decorate([
    (0, common_1.Get)('student/projects'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getMyProjects", null);
__decorate([
    (0, common_1.Get)('admin/submissions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN', 'MENTOR'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getAdminSubmissions", null);
__decorate([
    (0, common_1.Get)('admin/submissions/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN', 'MENTOR'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getSubmission", null);
__decorate([
    (0, common_1.Post)('admin/submissions/:id/review'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN', 'MENTOR'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "review", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map