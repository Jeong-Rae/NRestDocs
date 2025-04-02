import { beforeEach, describe, expect, it } from "vitest";

import { getNRestDocsConfig, setNRestDocsConfig } from "./config";

import type { NRestDocsConfig } from "../types";

describe("config", () => {
    beforeEach(() => {
        setNRestDocsConfig({
            output: "./docs",
            format: "adoc",
            strict: false,
        });
    });

    describe("getNRestDocsConfig", () => {
        it("기본 설정을 반환한다", () => {
            // Given
            const expectedConfig: NRestDocsConfig = {
                output: "./docs",
                format: "adoc",
                strict: false,
            };

            // When
            const config = getNRestDocsConfig();

            // Then
            expect(config).toEqual(expectedConfig);
        });
    });

    describe("setNRestDocsConfig", () => {
        it("전체 설정을 갱신한다", () => {
            // Given
            const newConfig: NRestDocsConfig = {
                output: "./new-docs",
                format: "md",
                strict: true,
            };

            // When
            const updatedConfig = setNRestDocsConfig(newConfig);

            // Then
            expect(updatedConfig).toEqual(newConfig);
            expect(getNRestDocsConfig()).toEqual(newConfig);
        });

        it("부분 설정을 갱신한다", () => {
            // Given
            const partialConfig = {
                output: "./new-docs",
                strict: true,
            };

            // When
            const updatedConfig = setNRestDocsConfig(partialConfig);

            // Then
            expect(updatedConfig).toEqual({
                output: "./new-docs",
                format: "adoc",
                strict: true,
            });
            expect(getNRestDocsConfig()).toEqual({
                output: "./new-docs",
                format: "adoc",
                strict: true,
            });
        });

        it("빈 설정으로 갱신해도 기존 설정이 유지된다", () => {
            // Given
            const emptyConfig = {};

            // When
            const updatedConfig = setNRestDocsConfig(emptyConfig);

            // Then
            expect(updatedConfig).toEqual({
                output: "./docs",
                format: "adoc",
                strict: false,
            });
            expect(getNRestDocsConfig()).toEqual({
                output: "./docs",
                format: "adoc",
                strict: false,
            });
        });
    });
});
