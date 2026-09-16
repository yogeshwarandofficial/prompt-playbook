import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import type { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        user: {
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
        };
        access_token: string;
    }>;
    validateUserById(id: string): Promise<{
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
    } | null>;
}
