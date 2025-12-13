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
import { Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const token = await this.authService.register(dto);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true IN PRODUCTION (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true });
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(dto.email, dto.password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true IN PRODUCTION
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true });
  }

  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie("token");
    return res.send({ success: true });
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(@Req() req: Request) {
    return req.user;
  }
}
