/**
 * Expands a string literal type `T` to also allow any general string.
 *
 * Allows predefined values like `"success"` or `"error"` as well as custom strings like `"custom-status"`.
 *
 * @template T - A string literal type to be widened (e.g., `'success'`, `'error'`, etc.)
 *
 * @example
 * type Status = WidenString<'success' | 'error'>;
 *
 * const a: Status = 'success';        // allowed
 * const b: Status = 'error';          // allowed
 * const c: Status = 'custom-status';  // allowed
 * const d: Status = 123;             // error
 */
export type WidenString<T extends string> = T | (string & {});

/**
 * Expands a number literal type `T` to also allow any general number.
 *
 * @template T - A number literal type to be widened (e.g., `1`, `2`, etc.)
 *
 * @example
 * type NumberType = WidenNumber<1 | 2>;
 *
 * const a: NumberType = 1; // allowed
 * const b: NumberType = 2; // allowed
 * const c: NumberType = 3; // allowed
 * const d: NumberType = "string"; // error
 */
export type WidenNumber<T extends number> = T | (number & {});
