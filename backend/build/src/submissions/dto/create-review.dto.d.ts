import { ReviewDecision } from '@prisma/client';
export declare class CreateReviewDto {
    decision: ReviewDecision;
    feedback: string;
}
