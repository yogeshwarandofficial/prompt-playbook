import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
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
    
    // Auto-create EventCertificate table to ensure it exists on live databases
    try {
      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "EventCertificate" (
          "id" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          "eventName" TEXT NOT NULL,
          "eventDescription" TEXT,
          "certificateNo" TEXT NOT NULL,
          "verificationToken" TEXT NOT NULL,
          "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "EventCertificate_pkey" PRIMARY KEY ("id")
        );
      `);
      await this.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "EventCertificate_certificateNo_key" ON "EventCertificate"("certificateNo");`);
      await this.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "EventCertificate_verificationToken_key" ON "EventCertificate"("verificationToken");`);
    } catch (err) {
      this.logger.error('Failed to auto-create EventCertificate table', err);
    }
    
    this.logger.log('Prisma connected to Aiven PostgreSQL');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from Aiven PostgreSQL');
  }
}
