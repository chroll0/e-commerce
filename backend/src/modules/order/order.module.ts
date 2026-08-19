import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { NotificationModule } from "../notification/notification.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, RolesGuard],
  imports: [NotificationModule],
})
export class OrderModule {}
