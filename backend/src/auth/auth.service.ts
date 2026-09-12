import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import type { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { studentId, password } = loginDto;
    const normalizedStudentId = studentId.trim();

    const user = await this.prisma.user.findUnique({
      where: { studentId: normalizedStudentId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    const safeUser = { ...user };
    // @ts-expect-error we don't want to return passwordHash
    delete safeUser.passwordHash;

    return {
      user: safeUser,
      access_token: token,
    };
  }

  async validateUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || !user.isActive) {
      return null;
    }
    const safeUser = { ...user };
    // @ts-expect-error we don't want to return passwordHash
    delete safeUser.passwordHash;
    return safeUser;
  }
}
