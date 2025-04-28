import { Eta } from "eta";
import type { TemplateRenderer } from "./type";

export class EtaTemplateRenderer implements TemplateRenderer {
    private readonly eta: Eta;

    constructor() {
        this.eta = new Eta({
            autoEscape: false,
        });
    }

    async render(template: string, data: any): Promise<string> {
        return this.eta.renderStringAsync(template, data);
    }
}
