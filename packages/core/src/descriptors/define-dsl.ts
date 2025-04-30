import { DescriptorKinds, type FieldType } from "@/core";
import { descriptorFactory } from "./descriptor-factory";
import { type TypeBuilder, createTypeBuilder } from "./type-builder";

/** DSL for Descriptor */
export const defineQuery = descriptorFactory(DescriptorKinds.Query);
export const defineForm = descriptorFactory(DescriptorKinds.Form);
export const definePath = descriptorFactory(DescriptorKinds.Path);
export const defineHeader = descriptorFactory(DescriptorKinds.Header);
export const defineCookie = descriptorFactory(DescriptorKinds.Cookie);
export const definePart = descriptorFactory(DescriptorKinds.Part);
export const defineField = descriptorFactory(DescriptorKinds.Field);

/** DSL for Type */
export function defineType(initial: FieldType): TypeBuilder<{ type: FieldType }> {
    return createTypeBuilder({ type: initial });
}
