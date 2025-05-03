import type { NRestDocsConfig } from "@/config";
import { given } from "@/utils/test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AsciiDocWriter } from "./adoc-writer";

vi.mock("fs/promises", () => ({
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/config/provider", () => ({
    ConfigService: {
        get: vi.fn(),
    },
}));

import { ConfigService } from "@/config/provider";
import { mkdir, writeFile } from "fs/promises";
import * as naming from "./naming";

describe("AsciiDocWriter", () => {
    const baseConfig: NRestDocsConfig = {
        output: "./docs",
        format: "adoc",
        strict: false,
        directoryStructure: "flat",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (ConfigService.get as any).mockReturnValue(baseConfig);
        vi.spyOn(naming, "getOutputFileName");
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should create the output directory and write all snippet files", async () => {
        await given({
            identifier: "api-user",
            snippets: { foo: "foo-content", bar: "bar-content" },
        })
            .when(async ({ identifier, snippets }) => {
                const writer = new AsciiDocWriter(baseConfig);
                await writer.write(identifier, snippets);
            })
            .then(() => {
                expect(mkdir).toHaveBeenCalledWith("./docs", { recursive: true });
                expect(naming.getOutputFileName).toHaveBeenCalledWith(baseConfig, {
                    name: "foo",
                    identifier: "api-user",
                    extension: "adoc",
                });
                expect(naming.getOutputFileName).toHaveBeenCalledWith(baseConfig, {
                    name: "bar",
                    identifier: "api-user",
                    extension: "adoc",
                });
                expect(writeFile).toHaveBeenCalledWith("api-user-foo.adoc", "foo-content", "utf-8");
                expect(writeFile).toHaveBeenCalledWith("api-user-bar.adoc", "bar-content", "utf-8");
            });
    });

    it("should use nested directory structure if specified in config", async () => {
        const nestedConfig = { ...baseConfig, directoryStructure: "nested" } as NRestDocsConfig;
        (ConfigService.get as any).mockReturnValue(nestedConfig);
        await given({
            identifier: "user",
            snippets: { doc: "hello" },
        })
            .when(async ({ identifier, snippets }) => {
                const writer = new AsciiDocWriter(nestedConfig);
                await writer.write(identifier, snippets);
            })
            .then(() => {
                expect(mkdir).toHaveBeenCalledWith("./docs/user", { recursive: true });
                expect(naming.getOutputFileName).toHaveBeenCalledWith(nestedConfig, {
                    name: "doc",
                    identifier: "user",
                    extension: "adoc",
                });
            });
    });
});
