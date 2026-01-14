import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Locale } from "../../common/types/locale.types";

function parseLocale(locale?: string): Locale {
  if (!locale) return undefined;
  if (locale === "en" || locale === "ka") return locale;
  throw new BadRequestException('locale must be "en" or "ka"');
}

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query("locale") locale?: string) {
    return this.categoryService.findAll(parseLocale(locale));
  }

  @Get("slug/:slug")
  findBySlug(@Param("slug") slug: string, @Query("locale") locale?: string) {
    return this.categoryService.findBySlug(slug, parseLocale(locale));
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Query("locale") locale?: string
  ) {
    return this.categoryService.findOne(id, parseLocale(locale));
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
