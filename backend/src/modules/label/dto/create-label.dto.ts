import { IsNotEmpty, IsString } from "class-validator";

export class CreateLabelDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @IsNotEmpty()
  @IsString()
  nameKa: string;
}
