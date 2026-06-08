import {
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
import { StoreService } from "./store.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Controller("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort?: string,
  ) {
    const limitNum = limit ? Number(limit) : undefined;
    return this.storeService.findAll({
      search: search?.trim() || undefined,
      limit: limitNum,
      sort: (sort as "sales" | "rating" | "newest") || undefined,
    });
  }

  @Get("best")
  findBestStores(@Query("limit") limit?: string) {
    const limitNum = limit ? Number(limit) : 10;
    return this.storeService.findBestStores(limitNum);
  }

  @Get("slug/:slug")
  findBySlug(
    @Param("slug") slug: string,
    @Query("search") search?: string,
    @Query("categoryId") categoryId?: string,
    @Query("locale") locale?: string,
  ) {
    return this.storeService.findBySlug(slug, {
      search: search?.trim() || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      locale,
    });
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.storeService.remove(id);
  }
}
