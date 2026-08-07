import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../user/user.service";

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

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(dto);

    res.cookie("access_token", token, this.getCookieOptions());

    return { success: true };
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
}
