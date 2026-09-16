import { IsInt, IsNotEmpty, Min } from "class-validator";

export class AddToCartDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
