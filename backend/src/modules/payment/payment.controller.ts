import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRequest } from "../../common/types/auth.types";

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Step 1: Create payment (user must own the order)
  @Post(":orderId/create")
  createPayment(
    @Req() req: AuthRequest,
    @Param("orderId", ParseIntPipe) orderId: number
  ) {
    return this.paymentService.createPayment(req.user.id, orderId);
  }

  // Step 2: Confirm payment (user must own the order)
  @Post("confirm")
  confirmPayment(
    @Req() req: AuthRequest,
    @Body("paymentId") paymentId: string,
    @Body("orderId", ParseIntPipe) orderId: number
  ) {
    return this.paymentService.confirmPayment(req.user.id, paymentId, orderId);
  }
}
