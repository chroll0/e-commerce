import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { hash } from "bcryptjs";
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
}
