import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductModule } from "./modules/product/product.module";
import { AdminModule } from "./modules/admin/admin.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";
import { StoreModule } from "./modules/store/store.module";
import { CartModule } from "./modules/cart/cart.module";
import { ContactModule } from "./modules/contact/contact.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { NotificationModule } from "./modules/notification/notification.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CloudinaryModule,
    CategoryModule,
    ProductModule,
    AdminModule,
    StoreModule,
    CartModule,
    ContactModule,
    OrderModule,
    PaymentModule,
    NotificationModule,
  ],
})
export class AppModule {}
