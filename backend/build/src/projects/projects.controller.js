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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const create_phase_dto_1 = require("./dto/create-phase.dto");
const reorder_phases_dto_1 = require("./dto/reorder-phases.dto");
const create_topic_dto_1 = require("./dto/create-topic.dto");
const update_topic_dto_1 = require("./dto/update-topic.dto");
const reorder_topics_dto_1 = require("./dto/reorder-topics.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(dto) {
        return this.projectsService.createProject(dto);
    }
    findAll(status) {
        return this.projectsService.getProjects(status);
    }
    findOne(id) {
        return this.projectsService.getProject(id);
    }
    update(id, dto) {
        return this.projectsService.updateProject(id, dto);
    }
    addPhase(id, dto) {
        return this.projectsService.addPhase(id, dto);
    }
    reorderPhases(id, dto) {
        return this.projectsService.reorderPhases(id, dto);
    }
    updatePhase(id, phaseId, dto) {
        return this.projectsService.updatePhase(id, phaseId, dto);
    }
    deletePhase(id, phaseId) {
        return this.projectsService.deletePhase(id, phaseId);
    }
    addTopic(projectId, phaseId, dto) {
        return this.projectsService.addTopic(projectId, phaseId, dto);
    }
    reorderTopics(projectId, phaseId, dto) {
        return this.projectsService.reorderTopics(projectId, phaseId, dto);
    }
    updateTopic(projectId, phaseId, topicId, dto) {
        return this.projectsService.updateTopic(projectId, phaseId, topicId, dto);
    }
    deleteTopic(projectId, phaseId, topicId) {
        return this.projectsService.deleteTopic(projectId, phaseId, topicId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/phases'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_phase_dto_1.CreatePhaseDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addPhase", null);
__decorate([
    (0, common_1.Patch)(':id/phases/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_phases_dto_1.ReorderPhasesDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "reorderPhases", null);
__decorate([
    (0, common_1.Patch)(':id/phases/:phaseId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updatePhase", null);
__decorate([
    (0, common_1.Delete)(':id/phases/:phaseId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deletePhase", null);
__decorate([
    (0, common_1.Post)(':id/phases/:phaseId/topics'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_topic_dto_1.CreateTopicDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addTopic", null);
__decorate([
    (0, common_1.Patch)(':id/phases/:phaseId/topics/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reorder_topics_dto_1.ReorderTopicsDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "reorderTopics", null);
__decorate([
    (0, common_1.Patch)(':id/phases/:phaseId/topics/:topicId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Param)('topicId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_topic_dto_1.UpdateTopicDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateTopic", null);
__decorate([
    (0, common_1.Delete)(':id/phases/:phaseId/topics/:topicId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phaseId')),
    __param(2, (0, common_1.Param)('topicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deleteTopic", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('admin/projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map