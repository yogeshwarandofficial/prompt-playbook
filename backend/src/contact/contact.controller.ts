import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submit(
    @Body() body: CreateContactDto,
    @Req() req: Request,
  ) {
    const dto = plainToInstance(CreateContactDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map(e => Object.values(e.constraints ?? {})).flat());
    }

    // M-2: Use req.ip which respects the Express 'trust proxy' setting configured in main.ts.
    // This returns the real client IP when behind Render's proxy, without being
    // spoofable by a client sending a fake X-Forwarded-For header.
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    const result = await this.contactService.submit(dto, ip);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return result;
  }
}
