import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LabelService } from "./label.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";

@Controller()
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get("labels")
  findAll() {
    return this.labelService.findAll();
  }

  @Post("admin/labels")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }

  @Delete("admin/labels/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.labelService.remove(id);
  }
}
