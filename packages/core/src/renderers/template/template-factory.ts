import { EtaTemplateRenderer } from "./eta-renderer";
import type { TemplateRenderer } from "./template-renderer.type";

class TemplateRegistry {
    private static readonly registry: Record<string, TemplateRenderer> = {
        ".eta": new EtaTemplateRenderer(),
    };

    static get(extension: string): TemplateRenderer {
        const renderer = this.registry[extension];
        if (!renderer) {
            throw new Error(`Unsupported template extension: ${extension}`);
        }
        return renderer;
    }

    static register(extension: string, renderer: TemplateRenderer): void {
        this.registry[extension] = renderer;
    }
}

export function createTemplateRenderer(extension: string): TemplateRenderer {
    return TemplateRegistry.get(extension);
}
