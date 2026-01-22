import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Locale } from "../../common/types/locale.types";

function parseLocale(locale?: string): Locale {
  if (!locale) return "en";
  if (locale === "en" || locale === "ka") return locale;
  throw new BadRequestException('locale must be "en" or "ka"');
}

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  getDashboard(@Query("locale") locale?: string) {
    return this.adminService.getDashboard(parseLocale(locale));
  }

  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }
}
