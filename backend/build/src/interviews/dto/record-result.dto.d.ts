import { InterviewResult } from '@prisma/client';
export declare class RecordInterviewResultDto {
    result: InterviewResult;
    feedback?: string;
    technicalScore?: number;
    projectScore?: number;
    communicationScore?: number;
    overallScore?: number;
}
