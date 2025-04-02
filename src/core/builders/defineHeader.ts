import { HeaderDescriptor } from "../../types";

import { DescriptorBuilderInit, createDescriptorBuilder } from "./descriptor-builder";

export function defineHeader(name: string): DescriptorBuilderInit<HeaderDescriptor> {
    const descriptor: HeaderDescriptor = {
        name,
        type: "string", // 기본값
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor);
}
