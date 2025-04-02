// core/builders/definePart.ts
import { createDescriptorBuilder } from "./descriptor-builder";

import type { DescriptorBuilderInit } from "./descriptor-builder";
import type { PartDescriptor } from "../../types";

export function definePart(name: string): DescriptorBuilderInit<PartDescriptor> {
    const descriptor: PartDescriptor = {
        name,
        type: "string", // ex) file
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
