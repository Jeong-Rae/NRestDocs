import { ParamKinds, type PartDescriptor } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { RequestPartInput } from "./input.type";

export const applyRequestPart = (input: RequestPartInput): PartDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Part, PartDescriptor>(ParamKinds.Part, input);
};
