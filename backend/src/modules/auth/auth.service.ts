import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { User } from "@prisma/client";
import { JwtPayload } from "../../common/types/auth.types";
import { UserRole } from "../../common/enums/user-role.enum";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already in use");

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
    });

    return this.generateToken(user);
  }

  // LOGIN
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    return this.generateToken(user);
  }

  generateToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role as unknown as UserRole,
    };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
