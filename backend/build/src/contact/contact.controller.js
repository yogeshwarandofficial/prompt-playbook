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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const contact_service_1 = require("./contact.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ContactController = class ContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    async submit(body, req) {
        const dto = (0, class_transformer_1.plainToInstance)(create_contact_dto_1.CreateContactDto, body);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.map(e => Object.values(e.constraints ?? {})).flat());
        }
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.ip ||
            'unknown';
        const result = await this.contactService.submit(dto, ip);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_dto_1.CreateContactDto, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "submit", null);
exports.ContactController = ContactController = __decorate([
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map