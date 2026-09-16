import { Controller, Post, Body, Headers, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submit(
    @Body() body: CreateContactDto,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('x-real-ip') realIp?: string,
  ) {
    const dto = plainToInstance(CreateContactDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map(e => Object.values(e.constraints ?? {})).flat());
    }

    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

    const result = await this.contactService.submit(dto, ip);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return result;
  }
}
