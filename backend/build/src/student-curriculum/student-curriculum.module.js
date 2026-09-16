"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCurriculumModule = void 0;
const common_1 = require("@nestjs/common");
const student_curriculum_service_1 = require("./student-curriculum.service");
const student_curriculum_controller_1 = require("./student-curriculum.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let StudentCurriculumModule = class StudentCurriculumModule {
};
exports.StudentCurriculumModule = StudentCurriculumModule;
exports.StudentCurriculumModule = StudentCurriculumModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [student_curriculum_controller_1.StudentCurriculumController],
        providers: [student_curriculum_service_1.StudentCurriculumService],
        exports: [student_curriculum_service_1.StudentCurriculumService],
    })
], StudentCurriculumModule);
//# sourceMappingURL=student-curriculum.module.js.map