import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { ReviewDecision } from '@prisma/client';

export class CreateReviewDto {
  @IsEnum(ReviewDecision)
  decision: ReviewDecision;

  @IsString()
  @IsNotEmpty()
  feedback: string;
}
