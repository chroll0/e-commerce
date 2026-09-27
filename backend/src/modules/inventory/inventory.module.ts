import { Module } from "@nestjs/common";
import { OrderInventoryService } from "./order-inventory.service";

@Module({
  providers: [OrderInventoryService],
  exports: [OrderInventoryService],
})
export class InventoryModule {}
