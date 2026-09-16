"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = __importDefault(require("ws"));
const dns_1 = require("dns");
serverless_1.types.setTypeParser(1114, (str) => str);
serverless_1.types.setTypeParser(1184, (str) => str);
serverless_1.types.setTypeParser(1082, (str) => str);
(0, dns_1.setDefaultResultOrder)('ipv4first');
class IPv4WebSocket extends ws_1.default {
    constructor(address, protocols) {
        super(address, protocols, { family: 4 });
    }
}
serverless_1.neonConfig.webSocketConstructor = IPv4WebSocket;
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    pool;
    pingInterval = null;
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const pool = new serverless_1.Pool({ connectionString });
        const adapter = new adapter_neon_1.PrismaNeon(pool);
        super({ adapter });
        this.pool = pool;
        this.pool.on('error', (err) => {
            this.logger.error('Neon Pool Error:', err);
        });
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected via Neon WebSocket adapter (PrismaNeon, IPv4 Wrapper)');
        this.pingInterval = setInterval(async () => {
            try {
                await this.$queryRaw `SELECT 1`;
                this.logger.debug('Neon DB keep-alive ping successful');
            }
            catch (error) {
                this.logger.error('Neon DB keep-alive ping failed:', error);
            }
        }, 60000);
    }
    async onModuleDestroy() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        await this.$disconnect();
        await this.pool.end();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map