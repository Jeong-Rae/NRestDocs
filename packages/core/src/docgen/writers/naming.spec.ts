import type { NRestDocsConfig } from "@/config";
import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { getOutputFileName } from "./naming";

describe("getOutputFileName", () => {
    const baseConfig: NRestDocsConfig = {
        output: "./docs",
        format: "adoc",
        strict: false,
        directoryStructure: "flat",
    };

    it("should return 'identifier-name.extension' for flat directory structure", async () => {
        await given({
            config: { ...baseConfig, directoryStructure: "flat" },
            params: { name: "foo", identifier: "bar", extension: "adoc" },
        })
            .when(({ config, params }) => getOutputFileName(config, params))
            .then((result) => expect(result).toBe("bar-foo.adoc"));
    });

    it("should return 'identifier/name.extension' for nested directory structure", async () => {
        await given({
            config: { ...baseConfig, directoryStructure: "nested" },
            params: { name: "foo", identifier: "bar", extension: "adoc" },
        })
            .when(({ config, params }) => getOutputFileName(config, params))
            .then((result) => expect(result).toBe("bar/foo.adoc"));
    });

    it("should add a dot to the extension if it is missing", async () => {
        await given({
            config: { ...baseConfig, directoryStructure: "flat" },
            params: { name: "foo", identifier: "bar", extension: "md" },
        })
            .when(({ config, params }) => getOutputFileName(config, params))
            .then((result) => expect(result).toBe("bar-foo.md"));
    });

    it("should keep the extension as is if it already starts with a dot", async () => {
        await given({
            config: { ...baseConfig, directoryStructure: "flat" },
            params: { name: "foo", identifier: "bar", extension: ".adoc" },
        })
            .when(({ config, params }) => getOutputFileName(config, params))
            .then((result) => expect(result).toBe("bar-foo.adoc"));
    });

    it("should handle special characters in name and identifier correctly", async () => {
        await given({
            config: { ...baseConfig, directoryStructure: "nested" },
            params: { name: "f@o#o", identifier: "b/a:r", extension: "md" },
        })
            .when(({ config, params }) => getOutputFileName(config, params))
            .then((result) => expect(result).toBe("b/a:r/f@o#o.md"));
    });
});
