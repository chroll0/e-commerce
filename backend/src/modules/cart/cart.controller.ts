import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    const userId = req.user.id; // assume JWT Auth guard
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Patch(":id")
  updateCartItem(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItem(userId, id, dto);
  }

  @Delete(":id")
  removeCartItem(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.cartService.removeCartItem(userId, id);
  }
}
