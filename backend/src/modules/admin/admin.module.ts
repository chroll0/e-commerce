import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
