import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController, InterviewsResendController } from './interviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [InterviewsController, InterviewsResendController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
