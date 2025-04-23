import type { FieldDescriptor, HeaderDescriptor, PartDescriptor } from "../types";
import { type PartialWithName, normalizeDescriptors } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";

export function applyRequestHeaders(
    headers: (DescriptorBuilder<HeaderDescriptor> | PartialWithName<HeaderDescriptor>)[]
): HeaderDescriptor[] {
    return normalizeDescriptors(headers);
}

export function applyRequestParts(
    parts: (DescriptorBuilder<PartDescriptor> | PartDescriptor)[]
): PartDescriptor[] {
    return normalizeDescriptors(parts);
}

export function applyRequestFields(
    fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]
): FieldDescriptor[] {
    return normalizeDescriptors(fields);
}
