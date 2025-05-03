import { describe, expect, it } from "vitest";
import { given } from "./given";

describe("given", () => {
    it("should transform a synchronous value through when() and resolve in then()", async () => {
        await given(1)
            .when((x) => x + 1)
            .then((v) => expect(v).toBe(2));
    });

    it("should accept an asynchronous initial value and resolve correctly", async () => {
        await given(Promise.resolve("lyght"))
            .when((x) => x.toUpperCase())
            .then((v) => expect(v).toBe("LYGHT"));
    });

    it("should propagate through multiple when() calls in sequence", async () => {
        await given(1)
            .when((x) => x + 2) // 3
            .when((x) => x * 4) // 12
            .then((v) => expect(v).toBe(12));
    });

    it("should await asynchronous transformation inside when()", async () => {
        await given("nrest")
            .when(async (x) => x + "docs")
            .then((v) => expect(v).toBe("nrestdocs"));
    });

    it("should catch a synchronous error thrown inside when()", async () => {
        await given(1)
            .when(() => {
                throw new Error("fail-sync");
            })
            .catch((e) => {
                expect(e).toBeInstanceOf(Error);
                expect((e as Error).message).toBe("fail-sync");
            });
    });

    it("should catch an asynchronous error thrown inside when()", async () => {
        await given(1)
            .when(async () => {
                throw new Error("fail-async");
            })
            .catch((e) => {
                expect((e as Error).message).toBe("fail-async");
            });
    });

    it("should throw the default error if catch() is called but no error occurred", async () => {
        await given("ok").catch((e) => {
            expect((e as Error).message).toBe("Expected error, but none was thrown.");
        });
    });

    it("should transform complex types and preserve result across async chain", async () => {
        await given({ name: "foo" })
            .when((x) => x.name.toUpperCase())
            .then((s) => expect(s).toBe("FOO"));
    });

    it("should allow asynchronous assertions inside catch()", async () => {
        await given(0)
            .when(() => Promise.reject(new Error("deep")))
            .catch(async (err) => {
                await Promise.resolve();
                expect((err as Error).message).toBe("deep");
            });
    });
});
