import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Logger from "./logger";

describe("Logger", () => {
    beforeEach(() => {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: Mock implementation does not require a body
        vi.spyOn(console, "log").mockImplementation(() => {});
        // biome-ignore lint/suspicious/noEmptyBlockStatements: Mock implementation does not require a body
        vi.spyOn(console, "warn").mockImplementation(() => {});
        // biome-ignore lint/suspicious/noEmptyBlockStatements: Mock implementation does not require a body
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("info method should call console.log", () => {
        const args = ["Test message", 123];
        Logger.info(...args);
        expect(console.log).toHaveBeenCalledWith("\x1b[34m[INFO]\x1b[0m", ...args);
    });

    it("warn method should call console.warn", () => {
        const args = ["Warning message", { key: "value" }];
        Logger.warn(...args);
        expect(console.warn).toHaveBeenCalledWith("\x1b[33m[WARN]\x1b[0m", ...args);
    });

    it("error method should call console.error", () => {
        const args = [new Error("Something went wrong"), "details"];
        Logger.error(...args);
        expect(console.error).toHaveBeenCalledWith("\x1b[31m[ERROR]\x1b[0m", ...args);
    });
});
