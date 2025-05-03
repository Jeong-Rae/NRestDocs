import { InvalidTypeError } from "@/errors";
import { isString } from "es-toolkit/compat";

export type Filename = string;

// biome-ignore lint/suspicious/noControlCharactersInRegex: ignore
const invalidChars = /[<>:"/\\?*\u0000-\u001F|]/;

export function isValidFilename(name: string): name is Filename {
    return (
        isString(name) &&
        name.length > 0 &&
        name !== "." &&
        name !== ".." &&
        !invalidChars.test(name)
    );
}

/**
 * if the string is not a valid filename, throw an exception,
 * otherwise return the string as is.
 *
 * @param name the string to validate
 * @throws {InvalidTypeError} if the string is not a valid filename
 * @returns the safe filename string
 */
export function safeFilename(name: string): Filename {
    if (!isValidFilename(name)) {
        throw new InvalidTypeError({
            context: "safeFilename",
            fieldName: "name",
            expected: "valid filename string (no control/special characters)",
            actual: name,
        });
    }
    return name;
}
