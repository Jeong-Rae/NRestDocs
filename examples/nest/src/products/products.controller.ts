import { Body, Controller, Post } from "@nestjs/common";

@Controller("products")
export class ProductsController {
    @Post()
    create(@Body() dto: { name: string; price: number }) {
        return { id: Date.now(), ...dto };
    }
}
