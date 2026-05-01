import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Locale } from "../../common/types/locale.types";

function parseLocale(locale?: string): Locale {
  if (!locale) return undefined;
  if (locale === "en" || locale === "ka") return locale;
  throw new BadRequestException('locale must be "en" or "ka"');
}

function parseLimit(limit?: string): number | undefined {
  if (!limit) return undefined;
  const parsed = Number(limit);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new BadRequestException("limit must be a positive number");
  }
  return Math.floor(parsed);
}

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("categoryId") categoryId?: string,
    @Query("categorySlug") categorySlug?: string,
    @Query("locale") locale?: string,
    @Query("limit") limit?: string,
  ) {
    return this.productService.findAll({
      search,
      categoryId: categoryId ? Number(categoryId) : undefined,
      categorySlug,
      locale: parseLocale(locale),
      limit: parseLimit(limit),
    });
  }

  @Get("slug/:slug")
  findBySlug(@Param("slug") slug: string, @Query("locale") locale?: string) {
    return this.productService.findBySlug(slug, parseLocale(locale));
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Query("locale") locale?: string,
  ) {
    return this.productService.findOne(id, parseLocale(locale));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
