import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CategoryTranslationCreateDto {
  @IsIn(["en", "ka"])
  locale: "en" | "ka";

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationCreateDto)
  translations: CategoryTranslationCreateDto[];
}
