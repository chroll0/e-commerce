import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { PAYMENT_PROVIDER } from "./providers/payment-provider.interface";
import { TestPaymentProvider } from "./providers/test-payment.provider";

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    TestPaymentProvider,
    {
      provide: PAYMENT_PROVIDER,
      useExisting: TestPaymentProvider,
    },
  ],
})
export class PaymentModule {}
