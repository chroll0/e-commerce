import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CategoryTranslationUpdateDto {
  @IsIn(["en", "ka"])
  locale: "en" | "ka";

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationUpdateDto)
  translations?: CategoryTranslationUpdateDto[];
}
