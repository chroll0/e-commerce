import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  phone?: string | null;
}
