import path from "path";
import type { NRestDocsConfig } from "@/config/docs-config";
import { ConfigService } from "@/config/provider";
import { mkdir, writeFile } from "fs/promises";
import type { DocumentWriter } from "./writer.type";

export class AsciiDocWriter implements DocumentWriter {
    constructor(private config: NRestDocsConfig) {
        this.config = ConfigService.get();
    }

    async write(identifier: string, snippets: Record<string, string>): Promise<void> {
        const base =
            this.config.directoryStructure === "flat"
                ? this.config.output
                : path.join(this.config.output, identifier);

        await mkdir(base, { recursive: true });

        await Promise.all(
            Object.entries(snippets).map(async ([name, content]) => {
                const fileName =
                    this.config.directoryStructure === "flat"
                        ? `${identifier}-${name}.adoc`
                        : `${name}.adoc`;
                const filePath = path.join(base, fileName);
                await writeFile(filePath, content, "utf-8");
            })
        );
    }
}
