import { get, isFunction, map } from "es-toolkit/compat";

import type { BaseDescriptor } from "../../types/descriptors.type";
import type { DescriptorBuilder } from "../builders/descriptor-builder";

/**
 * 객체에 name 속성을 필수로 포함하는 Partial 타입
 */
export type PartialWithName<T extends { name: string }> = Partial<T> & { name: T["name"] };

/**
 * DescriptorBuilder 인스턴스 또는 Partial 객체 배열을 완전한 Descriptor 객체 배열로 정규화합니다.
 * - DescriptorBuilder 인스턴스는 toDescriptor() 메서드를 호출합니다.
 * - Partial 객체는 누락된 속성(예: type)에 기본값을 적용합니다.
 */
export function normalizeDescriptors<T extends BaseDescriptor>(
    descriptors: (DescriptorBuilder<T> | PartialWithName<T>)[]
): T[] {
    return map(descriptors, (descriptor) => {
        if (isFunction(get(descriptor, "toDescriptor"))) {
            return (descriptor as DescriptorBuilder<T>).toDescriptor();
        }

        const raw = descriptor as PartialWithName<T>;
        return {
            ...raw,
            type: raw.type ?? "string",
            optional: raw.optional ?? false,
        } as T;
    });
}
