import { PaymentStatus } from "@prisma/client";
import { PaymentSimulationOutcome } from "../dto/simulate-payment.dto";

export interface PaymentProvider {
  readonly providerName: string;
  createTransactionId(paymentId: string): Promise<string>;
  mapSimulationOutcome(outcome: PaymentSimulationOutcome): PaymentStatus;
}

export const PAYMENT_PROVIDER = "PAYMENT_PROVIDER";
