import type { PlainObject } from "@/types/object.type";

const JSON_FORMAT_SPACE = 2;

export function formatJson<T extends PlainObject>(
    value: T,
    options?: { replacer?: (key: string, value: unknown) => unknown; space?: number }
): string {
    return JSON.stringify(value, options?.replacer, options?.space ?? JSON_FORMAT_SPACE);
}
