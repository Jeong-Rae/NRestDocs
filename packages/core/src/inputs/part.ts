import { DescriptorKinds, type PartDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { RequestPartInput } from "./input.type";

export const applyRequestPart = (input: RequestPartInput): PartDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Part, PartDescriptor>(DescriptorKinds.Part, input);
};
