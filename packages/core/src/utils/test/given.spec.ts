import { describe, expect, it } from "vitest";
import { given, givenEach } from "./given";

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

    // --- 추가: inspect 기능 테스트 ---
    it("should allow inspecting the value in the chain using inspect()", async () => {
        let inspected: unknown = undefined;
        await given(10)
            .when((x) => x + 5)
            .inspect((v) => {
                inspected = v;
            })
            .when((x) => x * 2)
            .then((result) => {
                expect(inspected).toBe(15);
                expect(result).toBe(30);
            });
    });

    // --- 추가: given.each 기능 테스트 ---
    it("should transform multiple values using given.each and aggregate results", async () => {
        await given
            .each([1, 2, 3])
            .when((x) => x * 2)
            .then((results) => {
                expect(results).toEqual([2, 4, 6]);
            });
    });

    it("should allow inspecting each value in given.each using inspect()", async () => {
        const inspected: number[] = [];
        await given
            .each([1, 2, 3])
            .when((x) => x + 1)
            .inspect((v, i) => {
                inspected[i] = v;
            })
            .when((x) => x * 10)
            .then((results) => {
                expect(inspected).toEqual([2, 3, 4]);
                expect(results).toEqual([20, 30, 40]);
            });
    });

    it("should catch errors for all values in given.each and aggregate errors", async () => {
        await given
            .each([1, 2, 3])
            .when((x) => {
                if (x === 2) throw new Error("fail");
                return x;
            })
            .catch((errors) => {
                expect(errors.length).toBe(3);
                expect(errors[1]).toBeInstanceOf(Error);
                expect((errors[1] as Error).message).toBe("fail");
            });
    });
});

describe("given namespace", () => {
    it("should call given.each via namespace", () => {
        expect(given.each).toBe(givenEach);
    });
});
