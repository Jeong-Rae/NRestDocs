import Logger from "@/utils/logger";
import { Eta } from "eta";
import type { TemplateRenderer } from "./template-renderer.type";

export class EtaTemplateRenderer implements TemplateRenderer {
    private readonly eta: Eta;

    constructor() {
        this.eta = new Eta({
            autoEscape: false,
        });
    }

    async render(template: string, data: unknown): Promise<string> {
        Logger.info(template, data);
        return this.eta.renderStringAsync(template, data as object);
    }
}
