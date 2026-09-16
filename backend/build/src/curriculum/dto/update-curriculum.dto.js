"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurriculumDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_curriculum_dto_1 = require("./create-curriculum.dto");
class UpdateCurriculumDto extends (0, swagger_1.PartialType)(create_curriculum_dto_1.CreateCurriculumDto) {
}
exports.UpdateCurriculumDto = UpdateCurriculumDto;
//# sourceMappingURL=update-curriculum.dto.js.map