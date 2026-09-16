"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBatchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_batch_dto_1 = require("./create-batch.dto");
class UpdateBatchDto extends (0, swagger_1.PartialType)(create_batch_dto_1.CreateBatchDto) {
}
exports.UpdateBatchDto = UpdateBatchDto;
//# sourceMappingURL=update-batch.dto.js.map