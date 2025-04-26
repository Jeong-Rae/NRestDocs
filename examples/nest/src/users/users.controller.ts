import { Body, Controller, Get, Param, Post } from "@nestjs/common";

@Controller("users")
export class UsersController {
    @Post()
    create(@Body("name") name: string) {
        return { id: Date.now(), name };
    }
    @Get(":id")
    findOne(@Param("id") id: string) {
        return { id: +id, name: "홍길동" };
    }
}
