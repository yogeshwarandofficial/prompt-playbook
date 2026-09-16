import { ApplicationStatus } from '@prisma/client';
export declare class ReviewApplicationDto {
    status: ApplicationStatus;
    reviewNotes?: string;
    batchId?: string;
    curriculumVersionId?: string;
}
