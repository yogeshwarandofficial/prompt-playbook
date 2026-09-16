"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const health_module_1 = require("./health/health.module");
const admin_module_1 = require("./admin/admin.module");
const courses_module_1 = require("./courses/courses.module");
const student_module_1 = require("./student/student.module");
const events_module_1 = require("./events/events.module");
const projects_module_1 = require("./projects/projects.module");
const assignments_module_1 = require("./assignments/assignments.module");
const submissions_module_1 = require("./submissions/submissions.module");
const domains_module_1 = require("./domains/domains.module");
const specializations_module_1 = require("./specializations/specializations.module");
const batches_module_1 = require("./batches/batches.module");
const curriculum_module_1 = require("./curriculum/curriculum.module");
const applications_module_1 = require("./applications/applications.module");
const student_curriculum_module_1 = require("./student-curriculum/student-curriculum.module");
const interviews_module_1 = require("./interviews/interviews.module");
const certificates_module_1 = require("./certificates/certificates.module");
const automated_review_module_1 = require("./automated-review/automated-review.module");
const email_module_1 = require("./email/email.module");
const contact_module_1 = require("./contact/contact.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            admin_module_1.AdminModule,
            courses_module_1.CoursesModule,
            student_module_1.StudentModule,
            events_module_1.EventsModule,
            projects_module_1.ProjectsModule,
            assignments_module_1.AssignmentsModule,
            submissions_module_1.SubmissionsModule,
            domains_module_1.DomainsModule,
            specializations_module_1.SpecializationsModule,
            batches_module_1.BatchesModule,
            curriculum_module_1.CurriculumModule,
            applications_module_1.ApplicationsModule,
            student_curriculum_module_1.StudentCurriculumModule,
            interviews_module_1.InterviewsModule,
            certificates_module_1.CertificatesModule,
            automated_review_module_1.AutomatedReviewModule,
            email_module_1.EmailModule,
            contact_module_1.ContactModule,
            newsletter_module_1.NewsletterModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map