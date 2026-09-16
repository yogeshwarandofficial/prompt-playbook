import { IsEmail, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 200)
  subject: string;

  @IsString()
  @Length(20, 2000)
  message: string;
}
