import { IsOptional, IsString } from "class-validator";

export class UpdateLabelDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameKa?: string;
}
