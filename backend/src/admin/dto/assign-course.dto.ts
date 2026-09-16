import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
