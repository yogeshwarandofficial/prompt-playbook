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
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let ContactService = ContactService_1 = class ContactService {
    prisma;
    email;
    logger = new common_1.Logger(ContactService_1.name);
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    async submit(dto, ip) {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentCount = await this.prisma.contactSubmission.count({
            where: {
                ipAddress: ip,
                createdAt: { gte: hourAgo },
            },
        });
        if (recentCount >= 5) {
            return { success: false, message: 'Too many requests. Please try again later.' };
        }
        await this.prisma.contactSubmission.create({
            data: {
                name: dto.name,
                email: dto.email.toLowerCase(),
                subject: dto.subject,
                message: dto.message,
                ipAddress: ip,
            },
        });
        this.logger.log(`Contact form submission from ${dto.email} (IP: ${ip})`);
        this.email
            .sendContactConfirmation({
            name: dto.name,
            email: dto.email.toLowerCase(),
            subject: dto.subject,
            message: dto.message,
        })
            .catch((err) => this.logger.error('Failed to send contact confirmation email', err));
        this.email
            .sendContactAdminNotification({
            name: dto.name,
            email: dto.email.toLowerCase(),
            subject: dto.subject,
            message: dto.message,
            ip,
        })
            .catch((err) => this.logger.error('Failed to send admin notification email', err));
        return { success: true, message: 'Message sent successfully!' };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map