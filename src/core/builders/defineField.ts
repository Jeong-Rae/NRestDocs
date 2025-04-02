import { FieldDescriptor } from "../../types";

import { DescriptorBuilderInit, createDescriptorBuilder } from "./descriptor-builder";

export function defineField(name: string): DescriptorBuilderInit<FieldDescriptor> {
    const descriptor: FieldDescriptor = {
        name,
        type: "string",
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
