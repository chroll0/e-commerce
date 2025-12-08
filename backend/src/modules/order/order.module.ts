import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesGuard } from "../../common/guards/roles.guard";

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, RolesGuard],
})
export class OrderModule {}
