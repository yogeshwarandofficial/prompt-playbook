import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        batchId: string | null;
        college: string | null;
        degree: string | null;
        domainId: string | null;
        graduationYear: number | null;
        phone: string | null;
        specializationId: string | null;
    }>;
}
export {};
