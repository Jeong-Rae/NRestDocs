import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { DocumentSnapshot } from "@/builders";
import Logger from "@/utils/logger";
import { createTemplateRenderer } from "./template-renderer-factory";

export class AsciiDocRenderer {
    private templates: Record<string, { content: string; extension: string }> = {};

    private readonly defaultTemplateNames = [
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

    private readonly allowedExtensions = [".eta", ".ejs"];

    async load(): Promise<void> {
        const templatesDir = path.resolve(__dirname, "template");
        const missingTemplates: string[] = [];

        await Promise.all(
            this.defaultTemplateNames.map(async (templateName) => {
                let found = false;
                for (const extension of this.allowedExtensions) {
                    const fullPath = path.join(templatesDir, `${templateName}${extension}`);
                    const fileStat = await stat(fullPath);
                    if (fileStat.isFile()) {
                        const content = await readFile(fullPath, "utf-8");
                        this.templates[templateName] = {
                            content,
                            extension,
                        };
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    missingTemplates.push(templateName);
                }
            })
        );

        if (missingTemplates.length > 0) {
            Logger.error(`cannot find templates: ${missingTemplates.join(", ")}`);
        }
    }

    getTemplate(name: string): { content: string; extension: string } | undefined {
        return this.templates[name];
    }

    async render(snapshot: DocumentSnapshot, templateName: string): Promise<string> {
        const templateEntry = this.getTemplate(templateName);
        if (!templateEntry) {
            throw new Error(`Template not found: ${templateName}`);
        }

        const renderer = createTemplateRenderer(templateEntry.extension);
        const result = await renderer.render(templateEntry.content, { snapshot });

        return result;
    }
}
