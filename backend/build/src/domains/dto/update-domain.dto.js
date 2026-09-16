"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDomainDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_domain_dto_1 = require("./create-domain.dto");
class UpdateDomainDto extends (0, swagger_1.PartialType)(create_domain_dto_1.CreateDomainDto) {
}
exports.UpdateDomainDto = UpdateDomainDto;
//# sourceMappingURL=update-domain.dto.js.map