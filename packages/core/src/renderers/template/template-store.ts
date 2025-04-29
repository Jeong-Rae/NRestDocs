import fs from "node:fs/promises";
import path from "node:path";
import Logger from "@/utils/logger";

export type TemplateEntry = {
    content: string;
    extension: string;
};

export const ALLOWED_EXTENSIONS = [".eta"] as const;
export const DEFAULT_TEMPLATE_NAMES = [
    "default-curl-request",
    "default-form-request",
    "default-http-request",
    "default-http-response",
    "default-path-parameters",
    "default-query-parameters",
    "default-request-body",
    "default-request-cookie",
    "default-request-fields",
    "default-request-headers",
    "default-response-body",
    "default-response-cookie",
    "default-response-fields",
    "default-response-headers",
] as const;

export class TemplateStore {
    private readonly templates = new Map<string, TemplateEntry>();

    constructor(
        private readonly rootDir = path.resolve(__dirname, "..", "templates"),
        private readonly extensions = ALLOWED_EXTENSIONS
    ) {}

    async load(names: readonly string[]): Promise<void> {
        const missing: string[] = [];

        await Promise.all(
            names.map(async (name) => {
                let found = false;

                for (const extension of this.extensions) {
                    const filePath = path.join(this.rootDir, `${name}${extension}`);
                    try {
                        await fs.access(filePath);
                        found = true;
                        break;
                    } catch {
                        /* ignore */
                    }
                }

                if (!found) {
                    missing.push(name);
                }
            })
        );

        if (missing.length > 0) {
            Logger.error(`[TemplateStore] missing: ${missing.join(", ")}`);
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

    has(name: string): boolean {
        return this.templates.has(name);
    }

    list(): string[] {
        return Array.from(this.templates.keys());
    }
}
