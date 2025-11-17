import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

// Adjust these imports to match your actual DTO file paths/names
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ---------- UTILITIES ----------

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  private async validatePassword(
    plain: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  // ---------- TOKEN ISSUING / PAYLOAD ----------

  private async getTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      // secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      // secret: process.env.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: number, token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        isRevoked: false,
      },
    });
  }

  private async rotateRefreshToken(oldToken: string, newToken: string) {
    const existing = await this.prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });

    if (!existing || existing.isRevoked) {
      throw new ForbiddenException('Refresh token invalid or revoked');
    }

    // revoke old
    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { isRevoked: true },
    });

    // store new
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        token: newToken,
        expiresAt,
        isRevoked: false,
      },
    });
  }

  // ---------- AUTH FLOWS ----------

  // REGISTER
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await this.hashData(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name ?? null,
        passwordHash: hashed,       // ✅ matches schema
        role: UserRole.USER,        // ✅ enum
      },
    });

    const tokens = await this.getTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.validatePassword(
      dto.password,
      user.passwordHash,          // ✅ use passwordHash
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // CURRENT USER
  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  // REFRESH TOKENS (takes the raw refresh token string)
  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken /*, {
        // secret: process.env.JWT_REFRESH_SECRET,
      }*/);
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const existing = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!existing || existing.isRevoked) {
      throw new ForbiddenException('Refresh token invalid or revoked');
    }

    if (existing.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new ForbiddenException('User no longer exists');
    }

    const tokens = await this.getTokens(user);
    await this.rotateRefreshToken(refreshToken, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // LOGOUT (revoke all active refresh tokens for this user)
  async logout(userId: number) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    return { success: true };
  }
}
