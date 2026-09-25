import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { NotificationModule } from "../notification/notification.module";
import { InventoryModule } from "../inventory/inventory.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, RolesGuard],
  imports: [NotificationModule, InventoryModule],
})
export class OrderModule {}
