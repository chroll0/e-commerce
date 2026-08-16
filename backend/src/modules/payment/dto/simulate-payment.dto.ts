import { IsEnum } from "class-validator";

export enum PaymentSimulationOutcome {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export class SimulatePaymentDto {
  @IsEnum(PaymentSimulationOutcome)
  outcome: PaymentSimulationOutcome;
}
