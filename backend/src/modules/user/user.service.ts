import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { hash } from "bcryptjs";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRole } from "../../common/enums/user-role.enum";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
    });

    return this.findSafeById(user.id);
  }

  async updatePassword(id: number, password: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password,
        tokenVersion: { increment: 1 },
      },
    });
  }

  async updateRole(id: number, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role,
        tokenVersion: { increment: 1 },
      },
    });
  }

  async findSafeById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async listAddresses(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async createAddress(userId: number, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const hasAddress = await tx.address.count({ where: { userId } });
      return tx.address.create({
        data: { ...dto, isDefault: dto.isDefault ?? hasAddress === 0, userId },
      });
    });
  }

  async updateAddress(
    userId: number,
    addressId: number,
    dto: UpdateAddressDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id: addressId, userId },
      });
      if (!address) throw new NotFoundException("Address not found");

      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({ where: { id: addressId }, data: dto });
    });
  }

  async deleteAddress(userId: number, addressId: number) {
    return this.prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id: addressId, userId },
      });
      if (!address) throw new NotFoundException("Address not found");

      await tx.address.delete({ where: { id: addressId } });
      if (address.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }

      return { success: true };
    });
  }

  async setDefaultAddress(userId: number, addressId: number) {
    return this.prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id: addressId, userId },
      });
      if (!address) throw new NotFoundException("Address not found");

      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  }

  async getPreferences(userId: number) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async updatePreferences(userId: number, dto: UpdatePreferencesDto) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  async deleteAccount(userId: number, dto: DeleteAccountDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new NotFoundException("Invalid password");
    }

    const anonymizedEmail = `deleted-${userId}-${Date.now()}@deleted.invalid`;
    const anonymizedPassword = await hash(
      `${anonymizedEmail}-${Date.now()}`,
      10,
    );

    await this.prisma.$transaction([
      this.prisma.address.deleteMany({ where: { userId } }),
      this.prisma.userPreferences.deleteMany({ where: { userId } }),
      this.prisma.cartItem.deleteMany({ where: { userId } }),
      this.prisma.notification.deleteMany({ where: { userId } }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          password: anonymizedPassword,
          name: "Deleted User",
          phone: null,
          tokenVersion: { increment: 1 },
          emailVerifiedAt: null,
        },
      }),
    ]);

    return { success: true };
  }
}
