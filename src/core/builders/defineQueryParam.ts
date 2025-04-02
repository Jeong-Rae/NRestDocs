import { ParameterDescriptor } from "../../types";

import { DescriptorBuilderInit, createDescriptorBuilder } from "./descriptor-builder";

export function defineQueryParam(name: string): DescriptorBuilderInit<ParameterDescriptor> {
    const descriptor: ParameterDescriptor = {
        name,
        type: "string",
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
