import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthRequest } from "../../common/types/auth.types";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { VerifiedUserGuard } from "../../common/guards/verified-user.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  // Get current user's profile
  @Get("me")
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthRequest) {
    return this.userService.findSafeById(req.user.id);
  }

  // Update current user's profile
  @Patch("me")
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get("me/addresses")
  @UseGuards(JwtAuthGuard)
  listAddresses(@Req() req: AuthRequest) {
    return this.userService.listAddresses(req.user.id);
  }

  @Post("me/addresses")
  @UseGuards(JwtAuthGuard)
  createAddress(@Req() req: AuthRequest, @Body() dto: CreateAddressDto) {
    return this.userService.createAddress(req.user.id, dto);
  }

  @Patch("me/addresses/:addressId/default")
  @UseGuards(JwtAuthGuard)
  setDefaultAddress(
    @Req() req: AuthRequest,
    @Param("addressId", ParseIntPipe) addressId: number,
  ) {
    return this.userService.setDefaultAddress(req.user.id, addressId);
  }

  @Patch("me/addresses/:addressId")
  @UseGuards(JwtAuthGuard)
  updateAddress(
    @Req() req: AuthRequest,
    @Param("addressId", ParseIntPipe) addressId: number,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(req.user.id, addressId, dto);
  }

  @Delete("me/addresses/:addressId")
  @UseGuards(JwtAuthGuard)
  deleteAddress(
    @Req() req: AuthRequest,
    @Param("addressId", ParseIntPipe) addressId: number,
  ) {
    return this.userService.deleteAddress(req.user.id, addressId);
  }

  @Get("me/preferences")
  @UseGuards(JwtAuthGuard)
  getPreferences(@Req() req: AuthRequest) {
    return this.userService.getPreferences(req.user.id);
  }

  @Patch("me/preferences")
  @UseGuards(JwtAuthGuard)
  updatePreferences(
    @Req() req: AuthRequest,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.userService.updatePreferences(req.user.id, dto);
  }

  @Delete("me")
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Req() req: AuthRequest, @Body() dto: DeleteAccountDto) {
    return this.userService.deleteAccount(req.user.id, dto);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // Update user role (ADMIN only)
  @Patch(":id/role")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(
    @Param("id", ParseIntPipe) id: number,
    @Body("role") role: UserRole,
  ) {
    return this.userService.updateRole(id, role);
  }
}
