import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OrdersModule } from "./orders/orders.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Module({
    controllers: [AppController],
    providers: [AppService],
    imports: [UsersModule, ProductsModule, OrdersModule],
})
export class AppModule {}
