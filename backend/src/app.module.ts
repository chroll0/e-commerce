import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductModule } from "./modules/product/product.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    AdminModule,
  ],
})
export class AppModule {}
