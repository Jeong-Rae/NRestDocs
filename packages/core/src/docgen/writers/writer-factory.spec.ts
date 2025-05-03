import { ConfigService } from "@/config";
import type { NRestDocsConfig } from "@/config/docs-config";
import { beforeEach, describe, expect, it } from "vitest";
import { AsciiDocWriter } from "./adoc-writer";
import { createWriter } from "./writer-factory";

describe("createWriter", () => {
    beforeEach(() => {
        ConfigService.init();
    });

    it("should return AsciiDocWriter instance for adoc format", () => {
        const writer = createWriter({ format: "adoc" } as NRestDocsConfig);
        expect(writer).toBeInstanceOf(AsciiDocWriter);
    });

    it("should throw error for unsupported format", () => {
        // @ts-expect-error
        const call = () => createWriter({ format: "unknown" } as NRestDocsConfig);
        expect(call).toThrowError("Unsupported format: unknown");
    });
});
