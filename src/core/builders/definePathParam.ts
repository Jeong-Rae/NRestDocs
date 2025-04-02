import { createDescriptorBuilder } from "./descriptor-builder";

import type { DescriptorBuilderInit } from "./descriptor-builder";
import type { ParameterDescriptor } from "../../types";

export function definePathParam(name: string): DescriptorBuilderInit<ParameterDescriptor> {
    const descriptor: ParameterDescriptor = {
        name,
        type: "string",
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
