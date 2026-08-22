import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { randomBytes } from "crypto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const isHttps = process.env.FRONTEND_URL?.startsWith("https://") || false;
    const isSecureEnvironment = isProduction || isHttps;

    return {
      httpOnly: true,
      secure: isSecureEnvironment,
      sameSite: isSecureEnvironment ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as const;
  }

  private getOAuthStateOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 10 * 60 * 1000,
    };
  }

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto.email, dto.password);

    res.cookie("access_token", token, this.getCookieOptions());

    return { success: true };
  }

  @Get("verify-email")
  verifyEmail(@Req() req: Request) {
    const token = req.query.token;
    return this.authService.verifyEmail(String(token || ""));
  }

  @Post("resend-verification")
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    const options = this.getCookieOptions();

    res.clearCookie("access_token", options);

    return { success: true };
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(@Req() req: Request) {
    const user = req.user as any;

    return this.userService.findSafeById(user.id);
  }

  @Get("verify")
  @UseGuards(AuthGuard("jwt"))
  verify() {
    return { valid: true };
  }

  @Post("change-password")
  @UseGuards(AuthGuard("jwt"))
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as { id: number };

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    await this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );

    return { success: true };
  }

  @Get("google")
  startGoogle(@Req() req: Request, @Res() res: Response) {
    return this.startOAuth("google", req, res);
  }

  @Get("google/callback")
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.finishOAuth("google", req, res);
  }

  @Get("apple")
  startApple(@Req() req: Request, @Res() res: Response) {
    return this.startOAuth("apple", req, res);
  }

  @Get("apple/callback")
  async appleCallback(@Req() req: Request, @Res() res: Response) {
    return this.finishOAuth("apple", req, res);
  }

  private async startOAuth(
    provider: "google" | "apple",
    req: Request,
    res: Response,
  ) {
    const state = randomBytes(32).toString("hex");
    const locale =
      typeof req.query.locale === "string" && req.query.locale === "ka"
        ? "ka"
        : "en";
    await this.authService.createOAuthTransaction(provider, state, locale);
    res.cookie("oauth_state", state, this.getOAuthStateOptions());
    res.cookie("oauth_locale", locale, this.getOAuthStateOptions());
    return res.redirect(this.authService.getOAuthUrl(provider, state));
  }

  private async finishOAuth(
    provider: "google" | "apple",
    req: Request,
    res: Response,
  ) {
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const cookieState = req.cookies?.oauth_state;
    const locale = req.cookies?.oauth_locale === "ka" ? "ka" : "en";
    res.clearCookie("oauth_state", this.getOAuthStateOptions());
    res.clearCookie("oauth_locale", this.getOAuthStateOptions());

    if (!state || state !== cookieState) {
      if (cookieState) {
        await this.authService
          .consumeOAuthTransaction(provider, cookieState)
          .catch(() => undefined);
      }
      return res.redirect(this.frontendLoginErrorUrl(locale, "oauth_failed"));
    }

    try {
      await this.authService.consumeOAuthTransaction(provider, state);

      const providerError =
        typeof req.query.error === "string" ? req.query.error : "";
      if (providerError) {
        return res.redirect(
          this.frontendLoginErrorUrl(
            locale,
            providerError === "access_denied"
              ? "oauth_cancelled"
              : "oauth_failed",
          ),
        );
      }

      const code = typeof req.query.code === "string" ? req.query.code : "";
      if (!code) {
        return res.redirect(this.frontendLoginErrorUrl(locale, "oauth_failed"));
      }

      const token =
        provider === "google"
          ? await this.authService.completeGoogle(code)
          : await this.authService.completeApple(code);
      res.cookie("access_token", token, this.getCookieOptions());
      return res.redirect(this.frontendAccountUrl(locale));
    } catch (error) {
      const response =
        (error as any)?.response ?? (error as any)?.getResponse?.();
      const codeValue =
        response?.code === "OAUTH_ACCOUNT_LINK_REQUIRED"
          ? "OAUTH_ACCOUNT_LINK_REQUIRED"
          : "oauth_failed";
      return res.redirect(this.frontendLoginErrorUrl(locale, codeValue));
    }
  }

  private frontendAccountUrl(locale: string) {
    const base = (process.env.FRONTEND_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );
    return `${base}/${locale}/account`;
  }

  private frontendLoginErrorUrl(locale: string, code: string) {
    const base = (process.env.FRONTEND_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );
    const params = new URLSearchParams({ error: code });
    return `${base}/${locale}/auth/login?${params.toString()}`;
  }
}
