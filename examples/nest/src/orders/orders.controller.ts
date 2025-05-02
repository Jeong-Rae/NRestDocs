import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

@Controller("orders")
export class OrdersController {
    @Post()
    create(@Body() dto: { productId: number; qty: number }) {
        return { orderId: Date.now(), ...dto };
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return { orderId: +id, productId: 1, qty: 2, status: "pending" };
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return { orderId: +id, message: "Order deleted successfully" };
    }
}
