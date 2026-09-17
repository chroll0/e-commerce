import { Module } from "@nestjs/common";
import { LabelService } from "./label.service";
import { LabelController } from "./label.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [LabelController],
  providers: [LabelService, PrismaService],
  exports: [LabelService],
})
export class LabelModule {}
