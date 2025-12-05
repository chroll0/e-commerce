import { Controller, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Step 1: Create payment
  @Post(":orderId/create")
  createPayment(@Param("orderId", ParseIntPipe) orderId: number) {
    return this.paymentService.createPayment(orderId);
  }

  // Step 2: Confirm payment
  @Post("confirm")
  confirmPayment(
    @Body("paymentId") paymentId: string,
    @Body("orderId", ParseIntPipe) orderId: number
  ) {
    return this.paymentService.confirmPayment(paymentId, orderId);
  }
}
