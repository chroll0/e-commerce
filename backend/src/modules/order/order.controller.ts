import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderStatus } from "../../common/enums/order-status.enum";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create Order from Cart
  @Post()
  createOrder(@Req() req: any) {
    const userId = req.user.id;
    return this.orderService.createOrder(userId);
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
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: OrderStatus
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
