import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(["en", "ka"])
  language?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  orderNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;
}
