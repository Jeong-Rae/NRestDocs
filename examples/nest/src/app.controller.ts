import { Controller, Get } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Decorators and DI use these values at runtime
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        const hello = this.appService.getHello();
        return hello;
    }
}
