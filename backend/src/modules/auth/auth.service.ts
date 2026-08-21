import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { User } from "@prisma/client";
import { JwtPayload } from "../../common/types/auth.types";
import { UserRole } from "../../common/enums/user-role.enum";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../../common/email/email.service";
import { randomBytes, createHash } from "crypto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { OAuth2Client } from "google-auth-library";
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";
import { AuthProviderType } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  getOAuthUrl(provider: "google" | "apple", state: string) {
    if (provider === "google") {
      return this.getGoogleClient().generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        state,
        prompt: "select_account",
      });
    }

    const params = new URLSearchParams({
      response_type: "code",
      response_mode: "query",
      client_id: this.requiredEnv("APPLE_CLIENT_ID"),
      redirect_uri: this.requiredEnv("APPLE_CALLBACK_URL"),
      scope: "name email",
      state,
    });
    return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }

  async createOAuthTransaction(
    provider: "google" | "apple",
    state: string,
    locale: "en" | "ka",
  ) {
    await this.prisma.oAuthTransaction.create({
      data: {
        stateHash: this.hashToken(state),
        provider:
          provider === "google"
            ? AuthProviderType.GOOGLE
            : AuthProviderType.APPLE,
        locale,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  }

  async consumeOAuthTransaction(provider: "google" | "apple", state: string) {
    const now = new Date();
    const result = await this.prisma.oAuthTransaction.updateMany({
      where: {
        stateHash: this.hashToken(state),
        provider:
          provider === "google"
            ? AuthProviderType.GOOGLE
            : AuthProviderType.APPLE,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      data: { consumedAt: now },
    });

    if (!result.count) {
      throw new UnauthorizedException({
        code: "OAUTH_STATE_INVALID",
        message: "OAuth state is invalid or expired",
      });
    }
  }

  async completeGoogle(code: string) {
    const client = this.getGoogleClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) throw new UnauthorizedException("OAuth failed");
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.requiredEnv("GOOGLE_CLIENT_ID"),
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new UnauthorizedException("OAuth identity is not verified");
    }
    return this.authenticateOAuth(
      AuthProviderType.GOOGLE,
      payload.sub,
      payload.email,
      payload.name || payload.email.split("@")[0],
    );
  }

  async completeApple(code: string) {
    const privateKey = await importPKCS8(
      this.requiredEnv("APPLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
      "ES256",
    );
    const clientSecret = await new SignJWT({})
      .setProtectedHeader({
        alg: "ES256",
        kid: this.requiredEnv("APPLE_KEY_ID"),
      })
      .setIssuer(this.requiredEnv("APPLE_TEAM_ID"))
      .setSubject(this.requiredEnv("APPLE_CLIENT_ID"))
      .setAudience("https://appleid.apple.com")
      .setIssuedAt()
      .setExpirationTime("180d")
      .sign(privateKey);
    const response = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.requiredEnv("APPLE_CLIENT_ID"),
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.requiredEnv("APPLE_CALLBACK_URL"),
      }),
    });
    if (!response.ok) throw new UnauthorizedException("OAuth failed");
    const data = (await response.json()) as { id_token?: string };
    if (!data.id_token) throw new UnauthorizedException("OAuth failed");
    const keySet = createRemoteJWKSet(
      new URL("https://appleid.apple.com/auth/keys"),
    );
    const verified = await jwtVerify(data.id_token, keySet, {
      issuer: "https://appleid.apple.com",
      audience: this.requiredEnv("APPLE_CLIENT_ID"),
    });
    if (!verified.payload.sub || typeof verified.payload.email !== "string")
      throw new UnauthorizedException("OAuth identity is not verified");
    return this.authenticateOAuth(
      AuthProviderType.APPLE,
      verified.payload.sub,
      verified.payload.email,
      verified.payload.email.split("@")[0],
    );
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new ConflictException("Email already in use");

    const user = await this.userService.create({ ...dto, email });
    await this.issueVerificationToken(user.id, user.email);
    return { success: true, verificationRequired: true };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException({
        code: "EMAIL_NOT_VERIFIED",
        message: "Email verification is required",
      });
    }

    return this.generateToken(user);
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const now = new Date();
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt) {
      throw new BadRequestException({
        code: "INVALID_VERIFICATION_TOKEN",
        message: "Invalid verification token",
      });
    }
    if (record.expiresAt <= now) {
      throw new BadRequestException({
        code: "VERIFICATION_TOKEN_EXPIRED",
        message: "Verification token expired",
      });
    }

    await this.prisma.$transaction(async (tx) => {
      const consumed = await tx.emailVerificationToken.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (!consumed.count) {
        throw new BadRequestException({
          code: "INVALID_VERIFICATION_TOKEN",
          message: "Invalid verification token",
        });
      }

      await tx.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: now },
      });
      await tx.emailVerificationToken.updateMany({
        where: { userId: record.userId, id: { not: record.id }, usedAt: null },
        data: { usedAt: now },
      });
    });

    return { success: true, code: "EMAIL_VERIFIED" };
  }

  async resendVerification(email: string) {
    const user = await this.userService.findByEmail(email.trim().toLowerCase());
    if (user && !user.emailVerifiedAt) {
      await this.issueVerificationToken(user.id, user.email);
    }

    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email.trim().toLowerCase());
    if (user) await this.issuePasswordResetToken(user.id, user.email);
    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const tokenHash = this.hashToken(dto.token);
    const now = new Date();
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    if (!record || record.usedAt) {
      throw new BadRequestException({
        code: "INVALID_RESET_TOKEN",
        message: "Invalid reset token",
      });
    }
    if (record.expiresAt <= now) {
      throw new BadRequestException({
        code: "RESET_TOKEN_EXPIRED",
        message: "Reset token expired",
      });
    }

    const password = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$transaction(async (tx) => {
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (!consumed.count) {
        throw new BadRequestException({
          code: "INVALID_RESET_TOKEN",
          message: "Invalid reset token",
        });
      }
      await tx.user.update({
        where: { id: record.userId },
        data: { password, tokenVersion: { increment: 1 } },
      });
      await tx.passwordResetToken.updateMany({
        where: { userId: record.userId, id: { not: record.id }, usedAt: null },
        data: { usedAt: now },
      });
    });

    return { success: true };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) throw new UnauthorizedException("Invalid current password");

    if (currentPassword === newPassword) {
      throw new BadRequestException("New password must be different");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(userId, hashedPassword);
  }

  private generateToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      tokenVersion: user.tokenVersion,
    };

    return this.jwt.sign(payload);
  }

  private async issueVerificationToken(userId: number, email: string) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.emailVerificationToken.create({
        data: { userId, tokenHash, expiresAt },
      });
    });
    await this.emailService.sendVerificationEmail(email, rawToken);
  }

  private async issuePasswordResetToken(userId: number, email: string) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.passwordResetToken.create({
        data: { userId, tokenHash, expiresAt },
      });
    });
    await this.emailService.sendPasswordResetEmail(email, rawToken);
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private async authenticateOAuth(
    provider: AuthProviderType,
    providerAccountId: string,
    email: string,
    name: string,
  ) {
    const existingProvider = await this.prisma.oAuthAccount.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    });
    if (existingProvider) return this.generateToken(existingProvider.user);

    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException({
        code: "OAUTH_ACCOUNT_LINK_REQUIRED",
        message: "Sign in to the existing account before linking this provider",
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        password: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
        emailVerifiedAt: new Date(),
        oauthAccounts: { create: { provider, providerAccountId } },
      },
    });
    return this.generateToken(user);
  }

  private getGoogleClient() {
    return new OAuth2Client(
      this.requiredEnv("GOOGLE_CLIENT_ID"),
      this.requiredEnv("GOOGLE_CLIENT_SECRET"),
      this.requiredEnv("GOOGLE_CALLBACK_URL"),
    );
  }

  private requiredEnv(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not configured`);
    return value;
  }
}
