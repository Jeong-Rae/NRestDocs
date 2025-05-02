import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

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

    @Get(":id/settings")
    getUserSettings(@Param("id") id: string) {
        return { userId: +id, theme: "dark", notifications: true };
    }

    @Put(":id/profile")
    updateUserProfile(
        @Param("id") id: string,
        @Body() profile: { email?: string; phone?: string }
    ) {
        return { userId: +id, message: "Profile updated successfully", profile };
    }
}
