// core/builders/definePart.ts
import { PartDescriptor } from "../../types";

import { DescriptorBuilderInit, createDescriptorBuilder } from "./descriptor-builder";

export function definePart(name: string): DescriptorBuilderInit<PartDescriptor> {
    const descriptor: PartDescriptor = {
        name,
        type: "string", // ex) file
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
