import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ProductService } from "../product/product.service";
import { AssignLabelsDto } from "../label/dto/assign-labels.dto";
import { Locale } from "../../common/types/locale.types";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";

function parseLocale(locale?: string): Locale {
  if (!locale) return "en";
  if (locale === "en" || locale === "ka") return locale;
  throw new BadRequestException('locale must be "en" or "ka"');
}

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productService: ProductService,
  ) {}

  @Get("dashboard")
  getDashboard(@Query("locale") locale?: string) {
    return this.adminService.getDashboard(parseLocale(locale));
  }

  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }

  @Patch("products/:id/labels")
  setProductLabels(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AssignLabelsDto,
  ) {
    return this.productService.setLabels(id, dto.labelIds);
  }
}
