import { createDescriptorBuilder } from "./descriptor-builder";

import type { ParameterDescriptor } from "@/types";
import type { DescriptorBuilderInit } from "./descriptor-builder";

export function defineQueryParam(name: string): DescriptorBuilderInit<ParameterDescriptor> {
    const descriptor: ParameterDescriptor = {
        name,
        type: "string",
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
