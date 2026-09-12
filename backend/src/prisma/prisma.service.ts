import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig, types } from '@neondatabase/serverless';
import WebSocket from 'ws';
import { setDefaultResultOrder } from 'dns';

// Fix for Prisma P2023 "expected a string in column 'createdAt', found {}"
// Prisma expects the driver adapter to return raw strings for dates. 
// By default, Pool (pg) parses them into JS Date objects which serialize to {} 
// over the N-API boundary. We force pg to return raw strings.
types.setTypeParser(1114, (str) => str); // timestamp without time zone
types.setTypeParser(1184, (str) => str); // timestamp with time zone
types.setTypeParser(1082, (str) => str); // date

// ─── CONNECTION ARCHITECTURE ─────────────────────────────────────────────────
//
// NestJS → PrismaService → PrismaNeon (WebSocket Pool) → Neon DB
//
// WHY PrismaNeon (WebSocket Pool):
//   The HTTP adapter (PrismaNeonHTTP) uses fetch (`undici` or `node-fetch`).
//   On this specific Windows host, HTTP connections to Neon fail repeatedly due
//   to IPv6 dual-stack timeouts (ConnectTimeoutError) or ECONNRESET blocks.
//
// WHY IPv4WebSocket Wrapper:
//   By intercepting the `ws` constructor and injecting `{ family: 4 }`, we
//   force the Node.js native socket to strictly use IPv4. This instantly bypasses
//   the IPv6 timeouts without relying on global DNS hacks that `undici` ignores.
//
// WHY NO idleTimeoutMillis: 0:
//   Previously, setting `idleTimeoutMillis: 0` caused the pool to NEVER close
//   idle connections. Neon's proxy drops idle WebSockets after ~5 minutes.
//   By allowing the default idleTimeoutMillis (10s), idle WebSockets are cleanly
//   closed by the client before the server drops them, preventing dead connections
//   and "login fails after idle" errors.
//
// ─────────────────────────────────────────────────────────────────────────────

setDefaultResultOrder('ipv4first');

class IPv4WebSocket extends WebSocket {
  constructor(address: string | URL, protocols?: string | string[]) {
    // Force the underlying Node.js socket to connect over IPv4 only
    super(address, protocols, { family: 4 });
  }
}

neonConfig.webSocketConstructor = IPv4WebSocket;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    
    // Default Pool settings: idleTimeoutMillis is 10000ms.
    // This ensures WebSockets don't idle long enough for Neon to drop them.
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    super({ adapter } as any);
    this.pool = pool;

    this.pool.on('error', (err) => {
      this.logger.error('Neon Pool Error:', err);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected via Neon WebSocket adapter (PrismaNeon, IPv4 Wrapper)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
