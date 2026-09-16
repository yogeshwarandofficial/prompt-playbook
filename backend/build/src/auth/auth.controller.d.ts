import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response): Promise<{
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
    logout(res: Response): Promise<{
        success: boolean;
    }>;
    getMe(req: any): any;
}
