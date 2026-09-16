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
exports.InterviewsResendController = exports.InterviewsController = void 0;
const common_1 = require("@nestjs/common");
const interviews_service_1 = require("./interviews.service");
const schedule_interview_dto_1 = require("./dto/schedule-interview.dto");
const record_result_dto_1 = require("./dto/record-result.dto");
const update_interview_dto_1 = require("./dto/update-interview.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const email_service_1 = require("../email/email.service");
let InterviewsController = class InterviewsController {
    interviewsService;
    emailService;
    constructor(interviewsService, emailService) {
        this.interviewsService = interviewsService;
        this.emailService = emailService;
    }
    schedule(dto) {
        return this.interviewsService.scheduleInterview(dto);
    }
    findAll(status) {
        return this.interviewsService.findAll(status);
    }
    findOne(id) {
        return this.interviewsService.findOne(id);
    }
    update(id, dto) {
        return this.interviewsService.updateInterview(id, dto);
    }
    cancel(id) {
        return this.interviewsService.cancelInterview(id);
    }
    noShow(id) {
        return this.interviewsService.markNoShow(id);
    }
    recordResult(id, dto) {
        return this.interviewsService.recordResult(id, dto);
    }
};
exports.InterviewsController = InterviewsController;
__decorate([
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_interview_dto_1.ScheduleInterviewDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "schedule", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_interview_dto_1.UpdateInterviewDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/no-show'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "noShow", null);
__decorate([
    (0, common_1.Patch)(':id/result'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_result_dto_1.RecordInterviewResultDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "recordResult", null);
exports.InterviewsController = InterviewsController = __decorate([
    (0, common_1.Controller)('admin/interviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService,
        email_service_1.EmailService])
], InterviewsController);
let InterviewsResendController = class InterviewsResendController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async resendInvite(body) {
        const sent = await this.emailService.sendInterviewInvitation({
            applicantName: body.applicantName,
            applicantEmail: body.applicantEmail,
            scheduledAt: new Date(body.scheduledAt),
            meetingLink: body.meetingLink,
            interviewId: 'resend',
        });
        if (sent) {
            return { success: true };
        }
        return { success: false, message: 'Email delivery failed.' };
    }
};
exports.InterviewsResendController = InterviewsResendController;
__decorate([
    (0, common_1.Post)('resend-invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterviewsResendController.prototype, "resendInvite", null);
exports.InterviewsResendController = InterviewsResendController = __decorate([
    (0, common_1.Controller)('interviews'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], InterviewsResendController);
//# sourceMappingURL=interviews.controller.js.map