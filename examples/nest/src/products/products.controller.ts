import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller("products")
export class ProductsController {
    @Post()
    create(@Body() dto: { name: string; price: number }) {
        return { id: Date.now(), ...dto };
    }

    @Get()
    findAll() {
        return [
            { id: 1, name: "Product A", price: 100 },
            { id: 2, name: "Product B", price: 200 },
        ];
    }
}
