import { createDescriptorBuilder } from "./descriptor-builder";

import type { FieldDescriptor } from "../types";
import type { DescriptorBuilderInit } from "./descriptor-builder";

export function defineField(name: string): DescriptorBuilderInit<FieldDescriptor> {
    const descriptor: FieldDescriptor = {
        name,
        type: "string",
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
