import { Module } from '@nestjs/common';
import { AutomatedReviewService } from './automated-review.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AutomatedReviewService],
  exports: [AutomatedReviewService],
})
export class AutomatedReviewModule {}
