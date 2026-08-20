import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number; role?: string } }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();
    if (user.role === "ADMIN") return true;

    const current = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerifiedAt: true },
    });
    if (!current?.emailVerifiedAt) {
      throw new UnauthorizedException({
        code: "EMAIL_NOT_VERIFIED",
        message: "Email verification is required",
      });
    }
    return true;
  }
}
