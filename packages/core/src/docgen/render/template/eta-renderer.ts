import Logger from "@/utils/logger";
import { Eta } from "eta";
import type { TemplateRenderer } from "./template-renderer.type";

export class EtaTemplateRenderer implements TemplateRenderer {
    private readonly eta: Eta;

    constructor() {
        this.eta = new Eta({
            autoEscape: false,
            autoTrim: false,
        });
    }

    async render(template: string, data: unknown): Promise<string> {
        try {
            const output = await this.eta.renderStringAsync(template, data as object);
            return output;
        } catch (err) {
            Logger.error("[ETA] Template rendering failed.");
            Logger.error("[ETA] Error message:", (err as Error).message);
            Logger.error("[ETA] Stack trace:", (err as Error).stack);
            Logger.error("[ETA] Render data at failure:", JSON.stringify(data, null, 2));
            throw err;
        }
    }
}
