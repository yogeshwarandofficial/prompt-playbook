"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecializationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_specialization_dto_1 = require("./create-specialization.dto");
class UpdateSpecializationDto extends (0, swagger_1.PartialType)(create_specialization_dto_1.CreateSpecializationDto) {
}
exports.UpdateSpecializationDto = UpdateSpecializationDto;
//# sourceMappingURL=update-specialization.dto.js.map