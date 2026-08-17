import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { AuthRequest } from "../../common/types/auth.types";
import { SimulatePaymentDto } from "./dto/simulate-payment.dto";

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("admin")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Post(":orderId/create")
  createPayment(
    @Req() req: AuthRequest,
    @Param("orderId", ParseIntPipe) orderId: number,
  ) {
    return this.paymentService.createPayment(req.user.id, orderId);
  }

  @Get(":paymentId")
  getPayment(@Req() req: AuthRequest, @Param("paymentId") paymentId: string) {
    return this.paymentService.getPayment(req.user.id, paymentId);
  }

  @Post(":paymentId/simulate")
  simulatePayment(
    @Req() req: AuthRequest,
    @Param("paymentId") paymentId: string,
    @Body() dto: SimulatePaymentDto,
  ) {
    return this.paymentService.simulatePayment(req.user.id, paymentId, dto);
  }
}
