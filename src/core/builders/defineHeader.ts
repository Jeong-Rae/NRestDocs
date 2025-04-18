import { createDescriptorBuilder } from "./descriptor-builder";

import type { HeaderDescriptor } from "../../types";
import type { DescriptorBuilder } from "./descriptor-builder";

export function defineHeader(name: string): DescriptorBuilder<HeaderDescriptor> {
    const descriptor: HeaderDescriptor = {
        name,
        type: "string", // 기본값
        description: "",
        optional: false,
    };
    return createDescriptorBuilder(descriptor).type("string");
}
