import { DescriptorKinds, type HeaderDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { HeaderInput } from "./input.type";

export const applyHeader = (input: HeaderInput): HeaderDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Header, HeaderDescriptor>(
        DescriptorKinds.Header,
        input
    );
};
