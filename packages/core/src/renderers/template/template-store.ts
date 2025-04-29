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
    "request-cookie",
    "request-fields",
    "request-headers",
    "response-body",
    "response-cookie",
    "response-fields",
    "response-headers",
] as const;

export class TemplateStore {
    private readonly templates = new Map<string, TemplateEntry>();

    constructor(
        private readonly rootDir = path.resolve(__dirname, "..", "src", "templates"),
        private readonly extensions = ALLOWED_EXTENSIONS
    ) {}

    async load({ useDefault = true }: { useDefault?: boolean } = {}): Promise<void> {
        const missing: string[] = [];

        await Promise.all(
            TEMPLATE_NAMES.map(async (name) => {
                const effectiveName = useDefault ? `default-${name}` : name;

                for (const extension of this.extensions) {
                    const filePath = path.join(this.rootDir, `${effectiveName}${extension}`);
                    Logger.info(`load template: ${filePath}`);
                    try {
                        const content = await fs.readFile(filePath, "utf-8");
                        this.add(name, { content, extension });
                        return;
                    } catch {
                        /* ignore */
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
        Logger.info(`get template: ${name}`);
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template not found: ${name}`);
        }
        return template;
    }
}
