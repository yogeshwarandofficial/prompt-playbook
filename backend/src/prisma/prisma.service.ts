import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ─── CONNECTION ARCHITECTURE ─────────────────────────────────────────────────
//
// NestJS → PrismaService → PrismaClient → Aiven PostgreSQL
//
// Standard Prisma connection via DATABASE_URL.
// SSL is enforced by including ?sslmode=require in the connection string.
// No adapter, no WebSocket pool, no keep-alive needed — Aiven uses a
// traditional persistent TCP connection compatible with standard pg.
//
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to Aiven PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from Aiven PostgreSQL');
  }
}
