import { Body, Controller, Post } from "@nestjs/common";

@Controller("orders")
export class OrdersController {
    @Post()
    create(@Body() dto: { productId: number; qty: number }) {
        return { orderId: Date.now(), ...dto };
    }
}
