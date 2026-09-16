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
var NewsletterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let NewsletterService = NewsletterService_1 = class NewsletterService {
    prisma;
    email;
    logger = new common_1.Logger(NewsletterService_1.name);
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    async subscribe(rawEmail) {
        const email = rawEmail.toLowerCase().trim();
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (existing) {
            return { success: true, message: "You're already subscribed! 🎉", alreadySubscribed: true };
        }
        await this.prisma.newsletterSubscriber.create({
            data: { email },
        });
        this.logger.log(`New newsletter subscriber: ${email}`);
        this.email
            .sendNewsletterWelcome(email)
            .catch((err) => this.logger.error('Failed to send newsletter welcome email', err));
        return { success: true, message: "You're subscribed! 🎉" };
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = NewsletterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map