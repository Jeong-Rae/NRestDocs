import { given } from "@/utils/test/given";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfigService } from "./config.service";

beforeEach(() => {
    // @ts-ignore
    ConfigService["instance"] = undefined;
});

describe("ConfigService", () => {
    it("should initialize only once", async () => {
        await given({
            config: ConfigService.init(),
        })
            .when(({ config }) => ({
                config1: config,
                config2: ConfigService.init(),
            }))
            .then(({ config1, config2 }) => {
                expect(config1).toEqual(config2);
            });
    });

    it("should return the same config instance with get", async () => {
        const config = await ConfigService.init();
        const config2 = ConfigService.get();
        expect(config).toBeDefined();
        expect(config).toEqual(config2);
    });

    it("should throw error if get is called before init", () => {
        expect(() => ConfigService.get()).toThrow();
    });

    it("should throw error if update is called before init", () => {
        expect(() => ConfigService.update({ output: "./output" })).toThrow();
    });

    it("should update config immutably", async () => {
        await ConfigService.init();
        ConfigService.update({
            output: "./output",
        });
        expect(ConfigService.get().output).toBe("./output");
    });

    it("should keep config immutable after update", async () => {
        await ConfigService.init();
        ConfigService.update({
            output: "./output",
        });
        expect(ConfigService.get().output).toBe("./output");
    });
});
