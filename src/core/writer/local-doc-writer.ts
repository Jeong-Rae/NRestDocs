import * as fs from "node:fs/promises";
import path from "node:path";
import { DocWriter } from "./doc-writer.interface";
import { DocWriterConfig } from "./doc-writer-config";

export class LocalDocWriter implements DocWriter {
    constructor(private readonly _config: DocWriterConfig) {}

    async writeSnippet(identifier: string, snippetName: string, content: string): Promise<void> {
        const filePath = this.buildFilePath(identifier, snippetName);
        await this.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, "utf-8");
    }

    async writeDocumentSnippets(
        identifier: string,
        snippetMap: Record<string, string>
    ): Promise<void> {
        await Promise.all(
            Object.entries(snippetMap).map(([snippetName, content]) =>
                this.writeSnippet(identifier, snippetName, content)
            )
        );
    }

    private buildFilePath(identifier: string, snippetName: string): string {
        const { outputDir, extension, directoryStructure } = this._config;
        const safeExtension = extension.startsWith(".") ? extension : `.${extension}`;

        switch (directoryStructure) {
            case "flat":
                return path.join(outputDir, `${identifier}-${snippetName}${safeExtension}`);
            case "nested":
            default:
                return path.join(outputDir, identifier, `${snippetName}${safeExtension}`);
        }
    }

    private async ensureDir(dirPath: string): Promise<void> {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }
}
