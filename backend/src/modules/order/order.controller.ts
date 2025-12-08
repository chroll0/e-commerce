import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderStatus } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create Order from Cart
  @Post()
  createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user.id;
    return this.orderService.createOrder(userId, dto);
  }

  // My orders
  @Get()
  getMyOrders(@Req() req: any) {
    const userId = req.user.id;
    return this.orderService.getMyOrders(userId);
  }

  // Single order details
  @Get(":id")
  getOrder(@Req() req: any, @Param("id", ParseIntPipe) orderId: number) {
    const userId = req.user.id;
    return this.orderService.getOrderById(userId, orderId);
  }

  // (admin only)
  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: OrderStatus
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
