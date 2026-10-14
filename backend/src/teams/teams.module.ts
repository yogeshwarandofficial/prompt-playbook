import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { StudentTeamsController } from './student-teams.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController, StudentTeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
