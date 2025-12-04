import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../../../common/enums/user-role.enum";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
