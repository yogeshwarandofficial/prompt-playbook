import { IsString, IsEnum } from 'class-validator';
import { CurriculumStatus } from '@prisma/client';

export class CreateCurriculumVersionDto {
  @IsString()
  curriculumId: string;

  @IsString()
  version: string;

  @IsEnum(CurriculumStatus)
  status: CurriculumStatus;
}
