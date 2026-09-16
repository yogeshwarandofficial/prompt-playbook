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
exports.StudentCurriculumController = void 0;
const common_1 = require("@nestjs/common");
const student_curriculum_service_1 = require("./student-curriculum.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let StudentCurriculumController = class StudentCurriculumController {
    studentCurriculumService;
    constructor(studentCurriculumService) {
        this.studentCurriculumService = studentCurriculumService;
    }
    getEnrollment(req) {
        return this.studentCurriculumService.getEnrollment(req.user.id);
    }
    getPhaseProgress(req, phaseId) {
        return this.studentCurriculumService.getPhaseProgress(req.user.id, phaseId);
    }
    completeTask(req, progressId, taskId) {
        return this.studentCurriculumService.completeTask(req.user.id, progressId, taskId);
    }
    uncompleteTask(req, progressId, taskId) {
        return this.studentCurriculumService.uncompleteTask(req.user.id, progressId, taskId);
    }
};
exports.StudentCurriculumController = StudentCurriculumController;
__decorate([
    (0, common_1.Get)('enrollment'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentCurriculumController.prototype, "getEnrollment", null);
__decorate([
    (0, common_1.Get)('phases/:phaseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('phaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentCurriculumController.prototype, "getPhaseProgress", null);
__decorate([
    (0, common_1.Post)('phases/:progressId/tasks/:taskId/complete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('progressId')),
    __param(2, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], StudentCurriculumController.prototype, "completeTask", null);
__decorate([
    (0, common_1.Delete)('phases/:progressId/tasks/:taskId/complete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('progressId')),
    __param(2, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], StudentCurriculumController.prototype, "uncompleteTask", null);
exports.StudentCurriculumController = StudentCurriculumController = __decorate([
    (0, common_1.Controller)('student/curriculum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    __metadata("design:paramtypes", [student_curriculum_service_1.StudentCurriculumService])
], StudentCurriculumController);
//# sourceMappingURL=student-curriculum.controller.js.map