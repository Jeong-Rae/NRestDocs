import { HeaderDescriptor } from "../../types";

import { DescriptorBuilder, createDescriptorBuilder } from "./descriptor-builder";

export function defineHeader(name: string): DescriptorBuilder<HeaderDescriptor> {
    const descriptor: HeaderDescriptor = {
        name,
        type: "string", // 기본값
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor).type("string");
}
