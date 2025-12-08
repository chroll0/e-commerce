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
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRequest } from "../../common/types/auth.types";

@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Req() req: AuthRequest, @Body() dto: AddToCartDto) {
    const userId = req.user.id; // assume JWT Auth guard
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Patch(":id")
  updateCartItem(
    @Req() req: AuthRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItem(userId, id, dto);
  }

  @Delete(":id")
  removeCartItem(
    @Req() req: AuthRequest,
    @Param("id", ParseIntPipe) id: number
  ) {
    const userId = req.user.id;
    return this.cartService.removeCartItem(userId, id);
  }
}
