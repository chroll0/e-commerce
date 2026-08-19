import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRequest } from "../../common/types/auth.types";
import { ListNotificationsDto } from "./dto/list-notifications.dto";
import { NotificationService } from "./notification.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list(@Req() req: AuthRequest, @Query() query: ListNotificationsDto) {
    return this.notificationService.list(
      req.user.id,
      query.page,
      query.limit,
      query.unread,
    );
  }

  @Patch("read-all")
  markAllAsRead(@Req() req: AuthRequest) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Patch(":id/read")
  markAsRead(@Req() req: AuthRequest, @Param("id") id: string) {
    return this.notificationService.markAsRead(req.user.id, id);
  }
}
