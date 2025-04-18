import type { FieldType } from "../types";
import type { BaseDescriptor } from "../types/descriptors.type";

/**
 * .type(...) 호출 전 상태
 */
export type DescriptorBuilderInit<T extends BaseDescriptor> = {
    type(type: FieldType): DescriptorBuilder<T>;
};

/**
 * .type(...) 호출 이후 상태 (description, optional, toDescriptor)
 */
export type DescriptorBuilder<T extends BaseDescriptor> = {
    description(description: string): DescriptorBuilder<T>;
    optional(): DescriptorBuilder<T>;
    toDescriptor(): T;
};

/**
 * 공통 빌더
 * @param descriptor 초기 descriptor 구조
 */
export function createDescriptorBuilder<T extends BaseDescriptor>(
    descriptor: T
): DescriptorBuilderInit<T> {
    const builder: DescriptorBuilder<T> = {
        description(description: string): DescriptorBuilder<T> {
            descriptor.description = description;
            return builder;
        },
        optional(): DescriptorBuilder<T> {
            descriptor.optional = true;
            return builder;
        },
        toDescriptor(): T {
            return { ...descriptor };
        },
    };

    return {
        type(type: FieldType): DescriptorBuilder<T> {
            descriptor.type = type;
            return builder;
        },
    };
}
