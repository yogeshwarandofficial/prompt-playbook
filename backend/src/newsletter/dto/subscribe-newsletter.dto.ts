import { IsEmail, MaxLength } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail()
  @MaxLength(254)  // L-1: RFC 5321 max email length
  email: string;
}
