import type { NRestDocsConfig } from "@/config/docs-config.type";
import { AsciiDocWriter } from "./adoc-writer";
import type { DocumentWriter } from "./writer.type";

export function createWriter(config: NRestDocsConfig): DocumentWriter {
    switch (config.format) {
        case "adoc":
            return new AsciiDocWriter(config);
        default:
            throw new Error(`Unsupported format: ${config.format}`);
    }
}
