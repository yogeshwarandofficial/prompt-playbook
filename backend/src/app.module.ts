import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
