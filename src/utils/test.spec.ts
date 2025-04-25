import { describe, expect, it } from "vitest";
import { given } from "./test";

describe("test", () => {
    describe("given", () => {
        it("should be able to perform a then assertion with a synchronous initial value", async () => {
            // Given
            const initialValue = 10;

            // When & Then
            await given(initialValue).then((value) => {
                expect(value).toBe(initialValue);
            });
        });

        it("should be able to perform a then assertion with an asynchronous initial value", async () => {
            // Given
            const initialValue = Promise.resolve(20);

            // When & Then
            await given(initialValue).then((value) => {
                expect(value).toBe(20);
            });
        });

        it("should be able to transform the value synchronously using when", async () => {
            // Given
            const initialValue = 5;
            const transformFn = (v: number) => v * 2;

            // When & Then
            await given(initialValue)
                .when(transformFn)
                .then((value) => {
                    expect(value).toBe(10);
                });
        });

        it("should be able to transform the value asynchronously using when", async () => {
            // Given
            const initialValue = 5;
            const asyncTransformFn = async (v: number) => {
                await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async work
                return v * 3;
            };

            // When & Then
            await given(initialValue)
                .when(asyncTransformFn)
                .then((value) => {
                    expect(value).toBe(15);
                });
        });

        it("should be able to chain multiple when calls to transform the value sequentially", async () => {
            // Given
            const initialValue = 2;
            const addOne = (v: number) => v + 1;
            const multiplyByTwo = async (v: number) => {
                await new Promise((resolve) => setTimeout(resolve, 5));
                return v * 2;
            };
            const numberToString = (v: number) => `Result: ${v}`;

            // When & Then
            await given(initialValue)
                .when(addOne)
                .when(multiplyByTwo)
                .when(numberToString)
                .then((value) => {
                    expect(value).toBe("Result: 6");
                });
        });

        it("should be able to perform asynchronous assertions within then", async () => {
            // Given
            const initialValue = true;
            let asyncCheckDone = false;

            // When & Then
            await given(initialValue).then(async (value) => {
                expect(value).toBe(true);
                await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async assertion part
                asyncCheckDone = true;
            });

            expect(asyncCheckDone).toBe(true);
        });
    });
});
