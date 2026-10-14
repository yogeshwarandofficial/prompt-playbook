import { IsString, IsUUID } from 'class-validator';

export class AddTeamMemberDto {
  @IsString()
  @IsUUID()
  studentId: string;
}
