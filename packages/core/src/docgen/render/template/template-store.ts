import fs from "node:fs/promises";
import path from "node:path";
import Logger from "@/utils/logger";

export type TemplateEntry = {
    content: string;
    extension: string;
};

export const ALLOWED_EXTENSIONS = [".eta"] as const;
export const TEMPLATE_NAMES = [
    "curl-request",
    "form-request",
    "http-request",
    "http-response",
    "path-parameters",
    "query-parameters",
    "request-body",
    "request-cookies",
    "request-fields",
    "request-headers",
    "response-body",
    "response-cookies",
    "response-fields",
    "response-headers",
] as const;

export class TemplateStore {
    private readonly templates = new Map<string, TemplateEntry>();

    constructor(
        private readonly rootDir = path.resolve(__dirname, "..", "src", "templates"),
        private readonly extensions = ALLOWED_EXTENSIONS,
        private useDefault = true
    ) {}

    async load(): Promise<void> {
        const missing: string[] = [];
        await Promise.all(
            TEMPLATE_NAMES.map(async (name) => {
                const effectiveName = this.useDefault ? `default-${name}` : name;

                for (const extension of this.extensions) {
                    const filePath = path.join(this.rootDir, `${effectiveName}${extension}`);
                    try {
                        const content = await fs.readFile(filePath, "utf-8");
                        this.add(name, { content, extension });
                        return;
                    } catch (error) {
                        Logger.warn(`Failed to load template: ${filePath}`, error);
                    }
                }
                missing.push(name);
            })
        );
        if (missing.length > 0) {
            Logger.error(`missing templates: ${missing.join(", ")}`);
        }
    }

    add(name: string, entry: TemplateEntry): void {
        this.templates.set(name, entry);
    }

    get(name: string): TemplateEntry {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template not found: ${name}`);
        }
        return template;
    }
}
