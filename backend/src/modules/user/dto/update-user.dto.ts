import { IsOptional, IsEmail, IsEnum } from "class-validator";
import { UserRole } from "../../../common/enums/user-role.enum";

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
