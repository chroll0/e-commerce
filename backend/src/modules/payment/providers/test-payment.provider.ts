import { Injectable } from "@nestjs/common";
import { PaymentStatus } from "@prisma/client";
import { PaymentProvider } from "./payment-provider.interface";
import { PaymentSimulationOutcome } from "../dto/simulate-payment.dto";

@Injectable()
export class TestPaymentProvider implements PaymentProvider {
  readonly providerName = "TEST";

  async createTransactionId(paymentId: string): Promise<string> {
    return `test_${paymentId}_${Date.now()}`;
  }

  mapSimulationOutcome(outcome: PaymentSimulationOutcome): PaymentStatus {
    if (outcome === PaymentSimulationOutcome.SUCCESS) return "SUCCESS";
    if (outcome === PaymentSimulationOutcome.FAILED) return "FAILED";
    return "CANCELLED";
  }
}
