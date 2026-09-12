const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Add SHORTLISTED to ApplicationStatus
schema = schema.replace(
  `enum ApplicationStatus {
  PENDING
  UNDER_REVIEW
  ACCEPTED
  REJECTED
}`,
  `enum ApplicationStatus {
  PENDING
  UNDER_REVIEW
  SHORTLISTED
  ACCEPTED
  REJECTED
}`
);

// 2. Change Interview model to relate to Application instead of Enrollment
schema = schema.replace(
  `enum InterviewStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}`,
  `enum InterviewStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}`
);

schema = schema.replace(
  `enum InterviewResult {
  PASSED
  FAILED
}`,
  `enum InterviewResult {
  PENDING
  SELECTED
  REJECTED
  ON_HOLD
}`
);

schema = schema.replace(
  `  enrollmentId       String
  enrollment         StudentCurriculumEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)`,
  `  applicationId      String
  application        Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)`
);

// Add interviews to Application model
schema = schema.replace(
  `  appliedAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}`,
  `  appliedAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  interviews       Interview[]
}`
);

// Remove interviews from StudentCurriculumEnrollment
schema = schema.replace(
  `  phaseProgress       StudentPhaseProgress[]
  interviews          Interview[]

  @@unique([studentId, curriculumVersionId])`,
  `  phaseProgress       StudentPhaseProgress[]

  @@unique([studentId, curriculumVersionId])`
);


// 3. Update Certificate model to use studentProjectId instead of enrollmentId
schema = schema.replace(
  `model Certificate {
  id                String            @id @default(uuid())
  studentId         String
  enrollmentId      String            @unique
  certificateNo     String            @unique // e.g. INFY-2026-00001`,
  `enum CertificateEligibility {
  NOT_ELIGIBLE
  ELIGIBLE
  ISSUED
  REVOKED
}

model Certificate {
  id                String            @id @default(uuid())
  studentId         String
  studentProjectId  String            @unique
  studentProject    StudentProject    @relation(fields: [studentProjectId], references: [id], onDelete: Cascade)
  certificateNo     String            @unique // e.g. INFY-2026-00001`
);

// Add certificate to StudentProject model
schema = schema.replace(
  `  phases StudentProjectPhase[]

  @@unique([studentId, projectId])`,
  `  phases StudentProjectPhase[]
  certificate Certificate?

  @@unique([studentId, projectId])`
);


// 4. Add AutomatedReview
const autoReviewModel = `
enum AutomatedReviewStatus {
  PENDING
  COMPLETED
  FAILED
}

model AutomatedReview {
  id           String                @id @default(uuid())
  submissionId String
  submission   Submission            @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  summary      String?
  detectedIssues Json?
  suggestions  Json?
  score        Int?
  status       AutomatedReviewStatus @default(PENDING)
  createdAt    DateTime              @default(now())
  updatedAt    DateTime              @updatedAt
}
`;
schema += autoReviewModel;

// Add automatedReviews to Submission
schema = schema.replace(
  `  reviews Review[]

  @@index([studentProjectPhaseId])`,
  `  reviews Review[]
  automatedReviews AutomatedReview[]

  @@index([studentProjectPhaseId])`
);

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema updated successfully');
