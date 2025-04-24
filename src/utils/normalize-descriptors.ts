import { isFunction, map } from "es-toolkit/compat";
import type { BaseDescriptor, Builder, TypeSet, TypeUnset } from "../descriptors";

/** name 필드가 필수인 Partial */
export type PartialWithName<T extends { name: string }> = Partial<T> & { name: T["name"] };

/** Builder | Partial 객체 → Descriptor 로 정규화 */
export function normalizeDescriptors<T extends BaseDescriptor>(
    descriptors: (Builder<T, TypeSet | TypeUnset, T["kind"]> | PartialWithName<T>)[]
): T[] {
    return map(descriptors, (descriptor) => {
        if (isFunction(descriptor as Record<string, unknown>["build"])) {
            return (descriptor as Builder<T, TypeSet, T["kind"]>).build();
        }
        const raw = descriptor as PartialWithName<T>;
        return {
            ...raw,
            type: raw.type ?? "string",
            ...(raw.optional === true && { optional: true }),
        } as T;
    });
}
