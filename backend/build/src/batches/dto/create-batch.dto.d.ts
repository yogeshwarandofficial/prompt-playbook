import { BatchStatus } from '@prisma/client';
export declare class CreateBatchDto {
    name: string;
    domainId: string;
    specializationId?: string;
    curriculumVersionId?: string;
    status: BatchStatus;
    startDate: string;
    durationWeeks: number;
    description?: string;
    isActive?: boolean;
}
