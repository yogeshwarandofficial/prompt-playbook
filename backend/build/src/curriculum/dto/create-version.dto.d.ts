import { CurriculumStatus } from '@prisma/client';
export declare class CreateCurriculumVersionDto {
    curriculumId: string;
    version: string;
    status: CurriculumStatus;
}
