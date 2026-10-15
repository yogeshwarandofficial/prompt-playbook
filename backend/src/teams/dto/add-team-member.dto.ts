import { IsString, IsUUID } from 'class-validator';

export class AddTeamMemberDto {
  @IsString()
  @IsUUID('4', { message: 'studentId must be a valid UUID' })
  studentId: string;
}

