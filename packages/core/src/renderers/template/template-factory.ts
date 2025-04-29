import { EtaTemplateRenderer } from "./eta-renderer";
import type { TemplateRenderer } from "./template-renderer.type";

export function createTemplateRenderer(extension: string): TemplateRenderer {
    switch (extension) {
        case ".eta":
            return new EtaTemplateRenderer();
        default:
            throw new Error(`Unsupported template extension: ${extension}`);
    }
}
