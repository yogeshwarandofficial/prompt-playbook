import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { StudentModule } from './student/student.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { DomainsModule } from './domains/domains.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { BatchesModule } from './batches/batches.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ApplicationsModule } from './applications/applications.module';
import { StudentCurriculumModule } from './student-curriculum/student-curriculum.module';
import { InterviewsModule } from './interviews/interviews.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AutomatedReviewModule } from './automated-review/automated-review.module';
import { EmailModule } from './email/email.module';
import { ContactModule } from './contact/contact.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // M-1: Global rate-limiter — provides ThrottlerGuard for use on individual routes
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60_000,  // 1 minute window
        limit: 10,    // 10 requests per minute (default for all routes)
      },
    ]),

    PrismaModule,
    AuthModule,
    HealthModule,
    AdminModule,
    CoursesModule,
    StudentModule,
    EventsModule,
    ProjectsModule,
    AssignmentsModule,
    SubmissionsModule,
    DomainsModule,
    SpecializationsModule,
    BatchesModule,
    CurriculumModule,
    ApplicationsModule,
    StudentCurriculumModule,
    InterviewsModule,
    CertificatesModule,
    AutomatedReviewModule,
    EmailModule,
    ContactModule,
    NewsletterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
