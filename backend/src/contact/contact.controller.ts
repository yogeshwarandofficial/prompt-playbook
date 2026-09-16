import { Controller, Post, Body, Req, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() body: CreateContactDto, @Req() req: Request) {
    const dto = plainToInstance(CreateContactDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map(e => Object.values(e.constraints ?? {})).flat());
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    const result = await this.contactService.submit(dto, ip);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return result;
  }
}
