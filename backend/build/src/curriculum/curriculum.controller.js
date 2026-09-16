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
exports.CurriculumController = void 0;
const common_1 = require("@nestjs/common");
const curriculum_service_1 = require("./curriculum.service");
const create_curriculum_dto_1 = require("./dto/create-curriculum.dto");
const update_curriculum_dto_1 = require("./dto/update-curriculum.dto");
const create_version_dto_1 = require("./dto/create-version.dto");
const create_phase_dto_1 = require("./dto/create-phase.dto");
const create_resource_dto_1 = require("./dto/create-resource.dto");
const create_task_dto_1 = require("./dto/create-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let CurriculumController = class CurriculumController {
    curriculumService;
    constructor(curriculumService) {
        this.curriculumService = curriculumService;
    }
    create(createCurriculumDto) {
        return this.curriculumService.create(createCurriculumDto);
    }
    findAll() {
        return this.curriculumService.findAll();
    }
    findOne(id) {
        return this.curriculumService.findOne(id);
    }
    update(id, updateCurriculumDto) {
        return this.curriculumService.update(id, updateCurriculumDto);
    }
    remove(id) {
        return this.curriculumService.remove(id);
    }
    createVersion(dto) {
        return this.curriculumService.createVersion(dto);
    }
    createPhase(versionId, dto) {
        return this.curriculumService.createPhase(versionId, dto);
    }
    createResource(phaseId, dto) {
        return this.curriculumService.createResource(phaseId, dto);
    }
    createTask(phaseId, dto) {
        return this.curriculumService.createTask(phaseId, dto);
    }
};
exports.CurriculumController = CurriculumController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_curriculum_dto_1.CreateCurriculumDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_curriculum_dto_1.UpdateCurriculumDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('versions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_version_dto_1.CreateCurriculumVersionDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Post)('versions/:versionId/phases'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_phase_dto_1.CreateCurriculumPhaseDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "createPhase", null);
__decorate([
    (0, common_1.Post)('phases/:phaseId/resources'),
    __param(0, (0, common_1.Param)('phaseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_resource_dto_1.CreateCurriculumResourceDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "createResource", null);
__decorate([
    (0, common_1.Post)('phases/:phaseId/tasks'),
    __param(0, (0, common_1.Param)('phaseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.CreateCurriculumTaskDto]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "createTask", null);
exports.CurriculumController = CurriculumController = __decorate([
    (0, common_1.Controller)('admin/curriculum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    __metadata("design:paramtypes", [curriculum_service_1.CurriculumService])
], CurriculumController);
//# sourceMappingURL=curriculum.controller.js.map