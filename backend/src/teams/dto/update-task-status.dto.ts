import { IsEnum } from 'class-validator';
import { TeamTaskStatus } from '@prisma/client';

export class UpdateTaskStatusDto {
  @IsEnum(TeamTaskStatus)
  status: TeamTaskStatus;
}
