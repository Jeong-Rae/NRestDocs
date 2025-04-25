import * as fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocalDocWriter } from "./local-doc-writer";

import type { DocWriterConfig } from "@/types/doc-writer-config.type";

// fs 모듈 모킹
vi.mock("node:fs/promises");

describe("local-doc-writer", () => {
    let config: DocWriterConfig;
    let writer: LocalDocWriter;

    beforeEach(() => {
        config = {
            outputDir: "test-output",
            extension: "adoc",
            directoryStructure: "nested",
        };
        writer = new LocalDocWriter(config);

        vi.clearAllMocks();
    });

    describe("writeSnippet", () => {
        it("nested 구조일 때 올바른 경로에 파일을 쓰고 디렉토리를 생성해야 한다", async () => {
            // Given
            const identifier = "test-api";
            const snippetName = "request-headers";
            const content = "= Request Headers";
            const expectedDir = path.join(config.outputDir, identifier);
            const expectedFilePath = path.join(expectedDir, `${snippetName}.${config.extension}`);

            // When
            await writer.writeSnippet(identifier, snippetName, content);

            // Then
            expect(fs.access).toHaveBeenCalledWith(expectedDir);
            expect(fs.writeFile).toHaveBeenCalledWith(expectedFilePath, content, "utf-8");
        });

        it("flat 구조일 때 올바른 경로에 파일을 쓰고 디렉토리를 생성해야 한다", async () => {
            // Given
            config.directoryStructure = "flat";
            writer = new LocalDocWriter(config);
            const identifier = "test-api";
            const snippetName = "response-fields";
            const content = "= Response Fields";
            const expectedDir = config.outputDir;
            const expectedFilePath = path.join(
                expectedDir,
                `${identifier}-${snippetName}.${config.extension}`
            );

            // When
            await writer.writeSnippet(identifier, snippetName, content);

            // Then
            expect(fs.access).toHaveBeenCalledWith(expectedDir);
            expect(fs.writeFile).toHaveBeenCalledWith(expectedFilePath, content, "utf-8");
        });

        it("확장자에 점(.)이 포함되어도 정상적으로 처리해야 한다", async () => {
            // Given
            config.extension = ".adoc";
            writer = new LocalDocWriter(config);
            const identifier = "another-api";
            const snippetName = "curl-request";
            const content = "curl ...";
            const expectedFilePath = path.join(
                config.outputDir,
                identifier,
                `${snippetName}${config.extension}`
            );

            // When
            await writer.writeSnippet(identifier, snippetName, content);

            // Then
            expect(fs.writeFile).toHaveBeenCalledWith(expectedFilePath, content, "utf-8");
        });

        it("ensureDir에서 디렉토리 접근 실패 시 mkdir을 호출해야 한다", async () => {
            // Given
            const identifier = "error-case";
            const snippetName = "http-request";
            const content = "GET / HTTP/1.1";
            const expectedDir = path.join(config.outputDir, identifier);

            // biome-ignore lint/suspicious/noExplicitAny: use any
            (fs.access as any).mockRejectedValue(new Error("ENOENT: no such file or directory"));

            // When
            await writer.writeSnippet(identifier, snippetName, content);

            // Then
            expect(fs.access).toHaveBeenCalledWith(expectedDir);
            expect(fs.mkdir).toHaveBeenCalledWith(expectedDir, { recursive: true });
        });
    });

    describe("writeDocumentSnippets", () => {
        it("주어진 snippetMap의 모든 스니펫에 대해 writeSnippet을 호출해야 한다", async () => {
            // Given
            const identifier = "multi-snippets";
            const snippetMap = {
                "request-headers": "= Request Headers",
                "response-body": '{ "id": 1 }',
            };
            const writeSnippetSpy = vi.spyOn(writer, "writeSnippet");

            // When
            await writer.writeDocumentSnippets(identifier, snippetMap);

            // Then
            expect(writeSnippetSpy).toHaveBeenCalledTimes(Object.keys(snippetMap).length);
            expect(writeSnippetSpy).toHaveBeenCalledWith(
                identifier,
                "request-headers",
                snippetMap["request-headers"]
            );
            expect(writeSnippetSpy).toHaveBeenCalledWith(
                identifier,
                "response-body",
                snippetMap["response-body"]
            );
        });
    });
});
