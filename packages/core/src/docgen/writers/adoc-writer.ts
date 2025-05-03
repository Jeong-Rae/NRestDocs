import path from "path";
import type { NRestDocsConfig } from "@/config/docs-config";
import { ConfigService } from "@/config/provider";
import { toPairs } from "es-toolkit/compat";
import { mkdir, writeFile } from "fs/promises";
import { getOutputFileName } from "./naming";
import type { DocumentWriter } from "./writer.type";

export class AsciiDocWriter implements DocumentWriter {
    constructor(private config: NRestDocsConfig) {
        this.config = ConfigService.get();
    }

    async write(identifier: string, snippets: Record<string, string>): Promise<void> {
        const base =
            this.config.directoryStructure === "flat"
                ? path.join(this.config.output)
                : path.join(this.config.output, identifier);

        await mkdir(base, { recursive: true });

        await Promise.all(
            toPairs(snippets).map(async ([name, content]) => {
                const fileName = getOutputFileName(this.config, {
                    name,
                    identifier,
                    extension: this.config.format,
                });
                const filePath = path.join(base, fileName);
                await writeFile(filePath, content, "utf-8");
            })
        );
    }
}
