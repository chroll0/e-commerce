import { IsString, IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  zip?: string;
}
